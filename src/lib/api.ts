import { supabase } from '@/lib/supabase';
import type { MenuItem, Order, OrderItemRow } from '@/types';

export async function fetchMenu(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('id, name, description, price, category, image_url, available')
    .eq('available', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as MenuItem[];
}

export async function createOrder(
  lines: { item: MenuItem; quantity: number }[],
): Promise<{ order: Order; items: OrderItemRow[] }> {
  const payload = {
    items: lines.map((l) => ({ id: l.item.id, quantity: l.quantity })),
  };

  const { data: order, error } = await supabase
    .rpc('create_order', { payload })
    .single();

  if (error) throw error;
  if (!order) throw new Error('No order returned from server');

  const typedOrder = order as unknown as Order;

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, menu_item_id, name, price, quantity')
    .eq('order_id', typedOrder.id)
    .order('name', { ascending: true });

  if (itemsError) throw itemsError;
  return { order: typedOrder, items: (items ?? []) as OrderItemRow[] };
}

export async function fetchOrderByToken(
  token: string,
): Promise<{ order: Order; items: OrderItemRow[] } | null> {
  const cleanToken = token.trim().toUpperCase();
  if (!cleanToken) return null;

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, token, status, total, created_at')
    .eq('token', cleanToken)
    .maybeSingle();

  if (error) throw error;
  if (!order) return null;

  const typedOrder = order as unknown as Order;

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, menu_item_id, name, price, quantity')
    .eq('order_id', typedOrder.id)
    .order('name', { ascending: true });

  if (itemsError) throw itemsError;
  return { order: typedOrder, items: (items ?? []) as OrderItemRow[] };
}
