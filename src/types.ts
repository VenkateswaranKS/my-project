export type Category =
  | 'dosa'
  | 'idli_vada'
  | 'rice'
  | 'snacks'
  | 'beverages'
  | 'sweets';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image_url: string;
  available: boolean;
}

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  token: string;
  status: 'pending' | 'preparing' | 'ready' | 'collected';
  total: number;
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  dosa: 'Dosa',
  idli_vada: 'Idli & Vada',
  rice: 'Rice Meals',
  snacks: 'Snacks',
  beverages: 'Beverages',
  sweets: 'Sweets',
};

export const CATEGORY_ORDER: Category[] = [
  'dosa',
  'idli_vada',
  'rice',
  'snacks',
  'beverages',
  'sweets',
];
