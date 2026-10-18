'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { MessageCircle, MapPin, Eye, EyeOff, Edit3, Trash2, Play } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onToggleEnable?: (id: string, currentVal: boolean) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({
  project,
  isAdmin,
  onToggleEnable,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
    const rotateY = ((x - centerX) / centerX) * 9;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi RedDot Interio, I am interested in the "${project.name}" (${project.category}) project in Hyderabad. Near price: ${project.offer_price}. Please share more details.`
  );
  const whatsappUrl = `https://wa.me/919348923689?text=${whatsappMessage}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale3d(1.01, 1.01, 1.01)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className={`group relative rounded-3xl overflow-hidden bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 shadow-lg hover:shadow-2xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-shadow duration-300 ${
        !project.enabled && isAdmin ? 'opacity-70 border-dashed border-amber-500' : ''
      }`}
    >
      {/* Glossy Reflection Highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${(tilt.y + 9) * 5}% ${(tilt.x + 9) * 5}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
        }}
      />

      {/* Media Container (Image or Video) */}
      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-neutral-900">
        {project.media_type === 'video' ? (
          <video
            src={project.media_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <img
            src={project.media_url}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Media Overlay Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/10">
            {project.category}
          </span>
          {project.media_type === 'video' && (
            <span className="p-1.5 rounded-full bg-brand-red text-white" title="Video Project">
              <Play className="w-3 h-3 fill-current" />
            </span>
          )}
        </div>

        {/* Admin Status Pill if Disabled */}
        {isAdmin && !project.enabled && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500 text-black shadow-md flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              Hidden from Public
            </span>
          </div>
        )}

        {/* Price Tag Over Media */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
          <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-white">
            <span className="text-[10px] uppercase tracking-wider text-white/60 block">Offer Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-semibold text-white">{project.offer_price}</span>
              {project.price && (
                <span className="text-xs text-white/50 line-through">{project.price}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {project.location && (
            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-brand-red" />
              <span>{project.location}</span>
            </div>
          )}

          <h3 className="text-xl font-normal text-neutral-900 dark:text-white mb-2 group-hover:text-brand-red transition-colors">
            {project.name}
          </h3>

          {project.description && (
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Customer Actions */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#0d0d0d] text-white dark:bg-white dark:text-[#0d0d0d] hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition-all shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        {/* Admin Controls (Only rendered if admin is logged in) */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 flex items-center justify-between gap-2 bg-neutral-50 dark:bg-neutral-900/80 p-2.5 rounded-2xl">
            <button
              onClick={() => onToggleEnable?.(project.id, project.enabled)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                project.enabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
              }`}
              title={project.enabled ? 'Click to hide from customers' : 'Click to enable for customers'}
            >
              {project.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{project.enabled ? 'Enabled' : 'Disabled'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit?.(project)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Edit Project"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete?.(project.id)}
                className="p-2 rounded-full hover:bg-red-500/10 text-neutral-400 hover:text-brand-red transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
