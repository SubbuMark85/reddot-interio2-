'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsGallery from '@/components/ProjectsGallery';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import QuoteBanner from '@/components/QuoteBanner';
import Footer from '@/components/Footer';
import AdminLoginModal from '@/components/AdminLoginModal';
import UploadModal from '@/components/UploadModal';
import EditProjectModal from '@/components/EditProjectModal';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import { Project, ProjectVideo } from '@/lib/types';
import { INITIAL_PROJECTS } from '@/lib/initialProjects';
import {
  supabase,
  isSupabaseConfigured,
  getStoredProjects,
  saveStoredProjects,
  getStoredAdminSession,
  saveStoredAdminSession,
} from '@/lib/supabase';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === 'undefined') {
      return INITIAL_PROJECTS.map((p) => ({
        ...p,
        price: p.show_price ? p.price : null,
        offer_price: p.show_price ? p.offer_price : null,
      }));
    }
    return getStoredProjects(false);
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [videoPlayerProject, setVideoPlayerProject] = useState<Project | null>(null);

  // Fetch projects and their associated videos from Supabase or fallback store
  const loadProjects = useCallback(async (currentIsAdmin: boolean) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const tableOrView = currentIsAdmin ? 'projects' : 'projects_public';
        const { data, error } = await supabase
          .from(tableOrView)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Fetch videos from project_videos table
          const { data: vidsData } = await supabase.from('project_videos').select('*');
          const videosList: ProjectVideo[] = (vidsData as ProjectVideo[]) || [];

          const merged = (data as Project[]).map((p) => ({
            ...p,
            videos: videosList.filter((v) => v.project_id === p.id),
          }));

          setProjects(merged);
          return;
        }
      }

      // Fallback to local storage (simulates projects_public for non-admins)
      const localData = getStoredProjects(currentIsAdmin);
      setProjects(localData);
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects(getStoredProjects(currentIsAdmin));
    }
  }, []);

  // Check initial admin session and load projects
  useEffect(() => {
    const checkSessionAndLoad = async () => {
      let loggedIn = false;
      let email: string | null = null;

      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          loggedIn = true;
          email = data.session.user.email;
        }
      }

      if (!loggedIn) {
        const storedSession = getStoredAdminSession();
        if (storedSession?.email) {
          loggedIn = true;
          email = storedSession.email;
        }
      }

      setIsAdmin(loggedIn);
      setAdminEmail(email);
      loadProjects(loggedIn);
    };

    checkSessionAndLoad();
  }, [loadProjects]);

  // Admin login handler
  const handleLoginSuccess = (email: string) => {
    setIsAdmin(true);
    setAdminEmail(email);
    loadProjects(true);
  };

  // Admin logout handler
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    saveStoredAdminSession(null);
    setIsAdmin(false);
    setAdminEmail(null);
    loadProjects(false);
  };

  // Toggle show_price instantly
  const handleToggleShowPrice = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;

    // Update state immediately
    const updated = projects.map((p) => (p.id === id ? { ...p, show_price: newVal } : p));
    setProjects(updated);
    saveStoredProjects(updated);

    // Sync with Supabase projects table
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('projects')
        .update({ show_price: newVal })
        .eq('id', id);

      if (error) {
        console.error('Supabase update show_price error:', error.message);
      }
    }
  };

  // Delete project
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project from RedDot Interio?')) {
      return;
    }

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveStoredProjects(updated);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error.message);
      }
    }
  };

  // When a new project is created via UploadModal
  const handleProjectCreated = (newProject: Project) => {
    const projectWithVideos: Project = {
      ...newProject,
      videos: newProject.videos || [],
    };
    const updated = [projectWithVideos, ...projects];
    setProjects(updated);
    saveStoredProjects(updated);
  };

  // When a project is edited via EditProjectModal
  const handleProjectUpdated = (updatedProject: Project) => {
    const updated = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    setProjects(updated);
    saveStoredProjects(updated);
  };

  return (
    <div className="min-h-screen bg-[#f6f3f0] dark:bg-[#0d0d0d] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 selection:bg-brand-red selection:text-white">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Rounded Sticky Header */}
      <Navbar
        isAdmin={isAdmin}
        adminEmail={adminEmail}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onLogout={handleLogout}
      />

      <main>
        {/* 3. Hero Section with 3D Glossy Spheres reacting to mouse */}
        <HeroSection />

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. Filterable Projects Gallery with 3D Tilt Cards & Show Price Switch */}
        <ProjectsGallery
          projects={projects}
          isAdmin={isAdmin}
          onToggleShowPrice={handleToggleShowPrice}
          onEdit={(proj) => setEditingProject(proj)}
          onDelete={handleDelete}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenVideos={(proj) => setVideoPlayerProject(proj)}
        />

        {/* 6. Why Us Section */}
        <WhyUsSection />

        {/* 7. Testimonials Section */}
        <TestimonialsSection />

        {/* 8. Quote / Estimate Planner Banner */}
        <QuoteBanner />
      </main>

      {/* 9. Footer */}
      <Footer
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* + Upload Work Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Edit Project Modal (Includes Project Videos section) */}
      <EditProjectModal
        isOpen={Boolean(editingProject)}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onProjectUpdated={handleProjectUpdated}
      />

      {/* Full-screen Video Player Modal */}
      <VideoPlayerModal
        isOpen={Boolean(videoPlayerProject)}
        project={videoPlayerProject}
        onClose={() => setVideoPlayerProject(null)}
      />
    </div>
  );
}
