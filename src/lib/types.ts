export type ProjectCategory = 
  | 'All'
  | 'Living Room'
  | 'Modular Kitchen'
  | 'Master Bedroom'
  | 'Luxury Villa'
  | 'Commercial';

export interface ProjectVideo {
  id: string;
  project_id: string;
  video_url: string;
  title: string;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  media_url: string; // Cover image for the project
  media_type: 'image' | 'video';
  price: string | null;
  offer_price: string | null;
  show_price: boolean;
  description?: string;
  location?: string;
  created_at?: string;
  videos?: ProjectVideo[];
}

export interface AdminUser {
  email: string;
  id?: string;
}
