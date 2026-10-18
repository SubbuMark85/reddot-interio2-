'use client';

import React, { useState, useRef } from 'react';
import { Project } from '@/lib/types';
import { MessageCircle, MapPin, EyeOff, Edit3, Trash2, Play, Tag } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onToggleShowPrice?: (id: string, currentVal: boolean) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onOpenVideos?: (project: Project) => void;
}

export default function ProjectCard({
  project,
  isAdmin,
  onToggleShowPrice,
  onEdit,
  onDelete,
  onOpenVideos,
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

    const rotateX = ((y - centerY) / centerY) * -9;
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

  // WhatsApp enquiry link (always available on every card)
  const enquiryPriceDetail = project.show_price && project.offer_price 
    ? ` Near price: ${project.offer_price}.` 
    : '';
  const enquireMessage = encodeURIComponent(
    `Hi RedDot Interio, I am interested in the "${project.name}" (${project.category}) project in Hyderabad.${enquiryPriceDetail} Please share more details.`
  );
  const enquireWhatsappUrl = `https://wa.me/919348923689?text=${enquireMessage}`;

  // WhatsApp "Contact for price" link (pre-filling the project name when price is hidden)
  const contactForPriceMessage = encodeURIComponent(
    `Hi RedDot Interio, I would like to know the price for the "${project.name}" (${project.category}) project in Hyderabad. Please share the pricing and package details.`
  );
  const contactForPriceUrl = `https://wa.me/919348923689?text=${contactForPriceMessage}`;

  const videoCount = project.videos?.length || 0;

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
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 shadow-lg hover:shadow-2xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-shadow duration-300"
    >
      {/* Glossy Reflection Highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${(tilt.y + 9) * 5}% ${(tilt.x + 9) * 5}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
        }}
      />

      {/* Media Container (Cover Image or Video) */}
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
          {videoCount > 0 && (
            <span
              onClick={() => onOpenVideos?.(project)}
              className="cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-brand-red text-white flex items-center gap-1 shadow-md hover:bg-brand-redHover transition-colors"
              title={`${videoCount} Video${videoCount > 1 ? 's' : ''} available`}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>{videoCount} Video{videoCount > 1 ? 's' : ''}</span>
            </span>
          )}
        </div>

        {/* Admin "Price hidden" Tag */}
        {isAdmin && !project.show_price && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-neutral-900/90 text-amber-300 border border-amber-400/40 shadow-md flex items-center gap-1 backdrop-blur-md">
              <EyeOff className="w-3 h-3 text-amber-400" />
              Price hidden
            </span>
          </div>
        )}

        {/* Price / "Contact for price" Overlay on Media */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
          {project.show_price && (project.offer_price || project.price) ? (
            <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-white">
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">Offer Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-semibold text-white">{project.offer_price || project.price}</span>
                {project.price && project.offer_price && (
                  <span className="text-xs text-white/50 line-through">{project.price}</span>
                )}
              </div>
            </div>
          ) : (
            <a
              href={contactForPriceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium bg-black/80 hover:bg-brand-red text-white backdrop-blur-md border border-white/20 transition-all shadow-md group/btn"
            >
              <Tag className="w-3.5 h-3.5 text-brand-red group-hover/btn:text-white" />
              <span>Contact for price</span>
            </a>
          )}
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

        {/* Customer Actions: Enquire on WhatsApp + ▶ Videos (N) */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2.5">
          <a
            href={enquireWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#0d0d0d] text-white dark:bg-white dark:text-[#0d0d0d] hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition-all shadow-sm active:scale-95 text-center"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white shrink-0" />
            <span className="truncate">Enquire on WhatsApp</span>
          </a>

          {/* ▶ Videos (N) button - rendered ONLY when project has at least 1 video */}
          {videoCount > 0 && (
            <button
              onClick={() => onOpenVideos?.(project)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white dark:bg-brand-red/20 dark:hover:bg-brand-red dark:text-brand-red dark:hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
              title={`Watch ${videoCount} video${videoCount > 1 ? 's' : ''} of ${project.name}`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Videos ({videoCount})</span>
            </button>
          )}
        </div>

        {/* Admin Controls: Show price switch, Edit and Delete */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t border-dashed border-black/10 dark:border-white/10 flex items-center justify-between gap-2 bg-neutral-50 dark:bg-neutral-900/80 p-2.5 rounded-2xl">
            {/* Show Price Switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleShowPrice?.(project.id, project.show_price)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                  project.show_price ? 'bg-brand-red' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
                title={project.show_price ? 'Click to hide price from customers' : 'Click to show price to customers'}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    project.show_price ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 select-none">
                {project.show_price ? 'Show price: On' : 'Show price: Off'}
              </span>
            </div>

            {/* Actions: Edit and Delete */}
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  title="Edit Project & Videos"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

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
