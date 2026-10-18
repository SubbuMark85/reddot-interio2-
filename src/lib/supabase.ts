import { createClient } from '@supabase/supabase-js';
import { Project } from './types';
import { INITIAL_PROJECTS } from './initialProjects';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback store key for development before connecting Supabase
const LOCAL_STORAGE_KEY = 'reddot_projects_store_v2';
const ADMIN_SESSION_KEY = 'reddot_admin_session_v1';

export const getStoredProjects = (isAdmin = false): Project[] => {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: Project[];
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      list = INITIAL_PROJECTS;
    } else {
      const parsed = JSON.parse(raw);
      // Migrate legacy projects if any
      list = parsed.map((item: any) => ({
        ...item,
        show_price: item.show_price !== undefined ? item.show_price : (item.enabled ?? true),
      }));
    }

    // Customer view: Every project is shown, but if show_price is false, price and offer_price are NULL
    if (!isAdmin) {
      return list.map((p) => ({
        ...p,
        price: p.show_price ? p.price : null,
        offer_price: p.show_price ? p.offer_price : null,
      }));
    }

    return list;
  } catch (err) {
    console.error('Error reading local projects:', err);
    return INITIAL_PROJECTS;
  }
};

export const saveStoredProjects = (projects: Project[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to localStorage:', err);
  }
};

export const getStoredAdminSession = (): { email: string } | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveStoredAdminSession = (email: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (email) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ email }));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (err) {
    console.error('Error saving admin session:', err);
  }
};
