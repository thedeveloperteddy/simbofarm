export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'eggs' | 'broilers' | 'feed' | 'chicks';
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: 'client' | 'admin';
  text: string;
  timestamp: string;
}