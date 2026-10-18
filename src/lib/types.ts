export type ProjectCategory = 
  | 'All'
  | 'Living Room'
  | 'Modular Kitchen'
  | 'Master Bedroom'
  | 'Luxury Villa'
  | 'Commercial';

export interface Project {
  id: string;
  name: string;
  category: string;
  media_url: string;
  media_type: 'image' | 'video';
  price: string | null;
  offer_price: string | null;
  show_price: boolean;
  description?: string;
  location?: string;
  created_at?: string;
}

export interface AdminUser {
  email: string;
  id?: string;
}
