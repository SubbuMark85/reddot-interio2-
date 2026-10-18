import { createClient } from '@supabase/supabase-js';
import { Project, ProjectVideo } from './types';
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
const LOCAL_STORAGE_KEY = 'reddot_projects_store_v3';
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
      list = parsed.map((item: any) => ({
        ...item,
        show_price: item.show_price !== undefined ? item.show_price : (item.enabled ?? true),
        videos: Array.isArray(item.videos) ? item.videos : [],
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

// ==========================================
// Video Management (Database & Storage)
// ==========================================

export async function fetchProjectVideos(projectId: string): Promise<ProjectVideo[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('project_videos')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      return data as ProjectVideo[];
    }
  }

  // Fallback to local storage
  const stored = getStoredProjects(true);
  const proj = stored.find((p) => p.id === projectId);
  return proj?.videos || [];
}

export async function uploadProjectVideoFile(
  projectId: string,
  file: File,
  title: string
): Promise<ProjectVideo> {
  const cleanTitle = title.trim() || file.name.replace(/\.[^/.]+$/, '');
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop() || 'mp4';
  const filePath = `videos/${projectId}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  let finalVideoUrl = '';

  if (isSupabaseConfigured && supabase) {
    // Upload to Supabase Storage bucket 'portfolio' under videos/<project_id>/
    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Video upload to Supabase failed: ${uploadError.message}`);
    }

    const { data: publicData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    finalVideoUrl = publicData.publicUrl;

    // Insert into project_videos table
    const { data, error } = await supabase
      .from('project_videos')
      .insert({
        project_id: projectId,
        video_url: finalVideoUrl,
        title: cleanTitle,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save video record: ${error.message}`);
    }

    return data as ProjectVideo;
  }

  // Local fallback: create object URL and save in localStorage
  finalVideoUrl = URL.createObjectURL(file);
  const newVideo: ProjectVideo = {
    id: `vid-${timestamp}`,
    project_id: projectId,
    video_url: finalVideoUrl,
    title: cleanTitle,
    created_at: new Date().toISOString(),
  };

  const stored = getStoredProjects(true);
  const updated = stored.map((p) => {
    if (p.id === projectId) {
      return {
        ...p,
        videos: [...(p.videos || []), newVideo],
      };
    }
    return p;
  });
  saveStoredProjects(updated);

  return newVideo;
}

export async function deleteProjectVideoRecord(
  videoId: string,
  videoUrl: string,
  projectId: string
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    // 1. Delete database row
    const { error: dbError } = await supabase
      .from('project_videos')
      .delete()
      .eq('id', videoId);

    if (dbError) {
      console.error('Error deleting video row:', dbError);
    }

    // 2. Remove file from storage bucket 'portfolio'
    try {
      const urlParts = videoUrl.split('/portfolio/');
      if (urlParts.length > 1) {
        const storagePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from('portfolio').remove([storagePath]);
      }
    } catch (storageErr) {
      console.warn('Could not remove video from storage:', storageErr);
    }
  }

  // Update local store
  const stored = getStoredProjects(true);
  const updated = stored.map((p) => {
    if (p.id === projectId && p.videos) {
      return {
        ...p,
        videos: p.videos.filter((v) => v.id !== videoId),
      };
    }
    return p;
  });
  saveStoredProjects(updated);
}
