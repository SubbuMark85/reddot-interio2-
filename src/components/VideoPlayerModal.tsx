'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Film, MessageCircle, Volume2 } from 'lucide-react';
import { Project, ProjectVideo } from '@/lib/types';

interface VideoPlayerModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ project, isOpen, onClose }: VideoPlayerModalProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Reset active video when opened for a new project
  useEffect(() => {
    setActiveVideoIndex(0);
  }, [project]);

  // Close modal on 'Esc' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project || !project.videos || project.videos.length === 0) {
    return null;
  }

  const activeVideo = project.videos[activeVideoIndex] || project.videos[0];
  const whatsappMessage = encodeURIComponent(
    `Hi RedDot Interio, I just watched the video for "${project.name}" (${activeVideo?.title || 'Tour'}) in Hyderabad. I would like more details.`
  );
  const whatsappUrl = `https://wa.me/919348923689?text=${whatsappMessage}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-brand-red animate-pulse shadow-[0_0_8px_rgba(229,38,45,0.8)]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  {project.category}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-brand-red font-medium">
                  Video {activeVideoIndex + 1} of {project.videos.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-light text-white tracking-tight">
                {project.name} — <span className="font-normal text-neutral-200">{activeVideo.title}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close video player"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[50vh] sm:min-h-[60vh]">
          {/* Main Video Viewport */}
          <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
            <video
              key={activeVideo.video_url}
              src={activeVideo.video_url}
              controls
              autoPlay
              playsInline
              className="w-full h-full max-h-[70vh] object-contain"
            />
          </div>

          {/* Playlist Sidebar if multiple videos, or Project Summary if single */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#141414] p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-brand-red" />
                  Project Videos ({project.videos.length})
                </h3>
              </div>

              {/* Video List */}
              <div className="space-y-2.5">
                {project.videos.map((vid, idx) => {
                  const isActive = idx === activeVideoIndex;
                  return (
                    <button
                      key={vid.id || idx}
                      onClick={() => setActiveVideoIndex(idx)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                        isActive
                          ? 'bg-brand-red/10 border-brand-red/50 text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-brand-red text-white'
                            : 'bg-black/40 text-neutral-400'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {vid.title || `Video ${idx + 1}`}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {isActive ? 'Now Playing' : 'Click to watch'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Project Specs */}
              <div className="mt-6 pt-5 border-t border-white/10 text-xs text-neutral-400 space-y-2">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-neutral-200">{project.location || 'Hyderabad'}</span>
                </div>
                {project.show_price && project.offer_price && (
                  <div className="flex justify-between">
                    <span>Offer Price:</span>
                    <span className="text-white font-semibold">{project.offer_price}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-4 border-t border-white/10 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium bg-brand-red text-white hover:bg-brand-redHover transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enquire via WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-full text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Close Player (Esc)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
