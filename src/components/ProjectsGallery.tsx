'use client';

import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '@/lib/types';
import ProjectCard from './ProjectCard';
import { Search } from 'lucide-react';

const CATEGORIES: ProjectCategory[] = [
  'All',
  'Living Room',
  'Modular Kitchen',
  'Master Bedroom',
  'Luxury Villa',
  'Commercial',
];

interface ProjectsGalleryProps {
  projects: Project[];
  isAdmin: boolean;
  onToggleShowPrice: (id: string, currentVal: boolean) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onOpenUpload: () => void;
  onOpenVideos: (project: Project) => void;
}

export default function ProjectsGallery({
  projects,
  isAdmin,
  onToggleShowPrice,
  onEdit,
  onDelete,
  onOpenUpload,
  onOpenVideos,
}: ProjectsGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Every project is visible to customers! Filter solely by category and search.
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Category filter
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchLocation = p.location?.toLowerCase().includes(query);
        const matchDesc = p.description?.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        return matchName || matchLocation || matchDesc || matchCategory;
      }

      return true;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold uppercase tracking-wider mb-3">
            Portfolio Showcase
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
            Selected Hyderabad <br className="hidden sm:inline" />
            <span className="font-normal text-neutral-900 dark:text-white">Residences &amp; Workspaces.</span>
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by area or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-[#f6f3f0] dark:bg-[#141414] border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
          />
        </div>
      </div>

      {/* Category Tabs Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-10 text-sm">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium text-xs sm:text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Admin Notice if Logged In */}
      {isAdmin && (
        <div className="mb-8 p-4 rounded-3xl bg-brand-red/5 border border-brand-red/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-red animate-pulse" />
            <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
              <span className="font-semibold text-brand-red">Admin Mode Active:</span> All projects are visible to customers. Use the &ldquo;Show price&rdquo; switch on any card to control whether prices or &ldquo;Contact for price&rdquo; is shown to customers.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-brand-red text-white hover:bg-brand-redHover shrink-0 shadow-sm"
          >
            + Upload New Project
          </button>
        </div>
      )}

      {/* Projects Grid with Tilt Cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isAdmin={isAdmin}
              onToggleShowPrice={onToggleShowPrice}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpenVideos={onOpenVideos}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 p-8">
          <p className="text-lg font-light text-neutral-600 dark:text-neutral-400 mb-4">
            No projects found matching your criteria.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
