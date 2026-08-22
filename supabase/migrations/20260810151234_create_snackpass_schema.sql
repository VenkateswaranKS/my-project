/*
# Campus SnackPass — initial schema

## Overview
Creates the data model for a campus canteen self-ordering kiosk app.
No authentication is required (kiosk/single-tenant), so the anon role
can read the menu and create orders. A SECURITY DEFINER function
performs the order insertion atomically and generates a unique,
human-readable collection token.

## New Tables

### menu_items
- `id` (uuid, primary key)
- `name` (text, not null) — display name of the dish
- `description` (text, not null) — short description
- `price` (numeric(10,2), not null) — unit price in currency
- `category` (text, not null) — one of: burgers, pizza, wraps, beverages, sides, desserts
- `image_url` (text, not null) — photo URL
- `available` (boolean, default true) — whether the item can be ordered
- `created_at` (timestamptz, default now())

### orders
- `id` (uuid, primary key)
- `token` (text, unique, not null) — human-readable collection token, e.g. "SP-7F3K-92"
- `status` (text, not null default 'pending') — pending | preparing | ready | collected
- `total` (numeric(10,2), not null) — total order value
- `created_at` (timestamptz, default now())

### order_items
- `id` (uuid, primary key)
- `order_id` (uuid, references orders(id) on delete cascade)
- `menu_item_id` (uuid, references menu_items(id))
- `name` (text, not null) — snapshot of item name at order time
- `price` (numeric(10,2), not null) — snapshot of unit price at order time
- `quantity` (integer, not null, check > 0)

## Functions

### create_order(jsonb)
SECURITY DEFINER, callable by anon/authenticated. Takes a JSON payload
of { items: [{ id, quantity }] }, validates each item exists and is
available, computes the total from the database prices (never trusts
client prices), inserts the order with a unique token, and inserts the
order_items rows atomically. Returns the order row.

## Security
- RLS enabled on all tables.
- menu_items: anon+authenticated can SELECT (public menu).
- orders: anon+authenticated can SELECT (so the user can look up their
  token). INSERT is handled by the SECURITY DEFINER function, so no
  direct INSERT policy is granted — clients cannot bypass the function.
  UPDATE/DELETE denied (no policies) to prevent tampering.
- order_items: anon+authenticated can SELECT. No direct INSERT/UPDATE/DELETE.
- create_order is SECURITY DEFINER and explicitly granted to anon,
  authenticated so the kiosk can place orders without auth.
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL CHECK (category IN ('burgers','pizza','wraps','beverages','sides','desserts')),
  image_url text NOT NULL,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','preparing','ready','collected')),
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(token);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- menu_items: public read for the kiosk
DROP POLICY IF EXISTS "anon_select_menu_items" ON menu_items;
CREATE POLICY "anon_select_menu_items" ON menu_items
  FOR SELECT TO anon, authenticated USING (true);

-- orders: public read so token lookups work; writes only via function
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders
  FOR SELECT TO anon, authenticated USING (true);

-- order_items: public read; writes only via function
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items
  FOR SELECT TO anon, authenticated USING (true);

-- Revoke any default write privileges to be safe
REVOKE INSERT, UPDATE, DELETE ON orders FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON order_items FROM anon, authenticated;

-- Atomic order creation function
CREATE OR REPLACE FUNCTION create_order(payload jsonb)
RETURNS orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_order orders%ROWTYPE;
  v_item jsonb;
  v_menu menu_items%ROWTYPE;
  v_total numeric(10,2) := 0;
BEGIN
  IF payload IS NULL OR jsonb_typeof(payload) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid payload: expected a JSON object';
  END IF;
  IF NOT (payload ? 'items') OR jsonb_typeof(payload->'items') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Invalid payload: missing "items" array';
  END IF;
  IF jsonb_array_length(payload->'items') = 0 THEN
    RAISE EXCEPTION 'Cannot create an empty order';
  END IF;

  -- Generate a unique human-readable token: SP-XXXX-NN
  v_token := 'SP-' || upper(substr(encode(gen_random_bytes(3), 'hex'), 1, 4))
             || '-' || lpad((random() * 99)::int::text, 2, '0');

  -- Insert the order header first (total computed below)
  INSERT INTO orders (token, status, total)
  VALUES (v_token, 'pending', 0)
  RETURNING * INTO v_order;

  -- Insert each line item, validating availability and pricing from DB
  FOR v_item IN SELECT jsonb_array_elements(payload->'items') LOOP
    SELECT * INTO v_menu FROM menu_items WHERE id = (v_item->>'id')::uuid;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Menu item not found: %', v_item->>'id';
    END IF;
    IF NOT v_menu.available THEN
      RAISE EXCEPTION 'Menu item unavailable: %', v_menu.name;
    END IF;

    INSERT INTO order_items (order_id, menu_item_id, name, price, quantity)
    VALUES (
      v_order.id,
      v_menu.id,
      v_menu.name,
      v_menu.price,
      (v_item->>'quantity')::int
    );

    v_total := v_total + (v_menu.price * (v_item->>'quantity')::int);
  END LOOP;

  -- Update the real total
  UPDATE orders SET total = v_total WHERE id = v_order.id;
  v_order.total := v_total;

  RETURN v_order;
END;
$$;

GRANT EXECUTE ON FUNCTION create_order(jsonb) TO anon, authenticated;
