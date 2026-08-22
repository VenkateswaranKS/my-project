/*
# Tighten menu_items privileges for anon

## Overview
Supabase grants anon full CRUD privileges on all tables by default. RLS
already blocks writes (no INSERT/UPDATE/DELETE policies exist), but
revoking the privileges adds defense-in-depth so the anon role cannot
write to menu_items even if RLS were accidentally disabled.

## Security
- REVOKE INSERT, UPDATE, DELETE on menu_items FROM anon, authenticated.
- SELECT remains (needed for the public menu).
*/

REVOKE INSERT, UPDATE, DELETE ON menu_items FROM anon, authenticated;
