import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Info, Star, Volume2, VolumeX, ShieldCheck, ChevronRight, Sliders } from 'lucide-react';
import { Anime } from '../types/anime';
import { AnimePoster } from './AnimePoster';
import { useAuth } from '../context/AuthContext';

interface HeroBannerProps {
  featuredAnimes: Anime[];
  onPlayAnime: (anime: Anime, episodeNumber?: number) => void;
  onOpenDetails: (anime: Anime) => void;
  isInWatchlist: (animeId: string) => boolean;
  onToggleWatchlist: (anime: Anime) => void;
  onEditAnime?: (anime: Anime) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredAnimes,
  onPlayAnime,
  onOpenDetails,
  isInWatchlist,
  onToggleWatchlist,
  onEditAnime,
}) => {
  const { isAdmin } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const currentAnime = featuredAnimes[currentIndex] || featuredAnimes[0];

  // Auto rotate banner every 8 seconds
  useEffect(() => {
    if (featuredAnimes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnimes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredAnimes.length]);

  if (!currentAnime) return null;

  const inList = isInWatchlist(currentAnime.id);

  return (
    <div className="relative w-full h-[580px] lg:h-[640px] overflow-hidden bg-[#0B0C0E] select-none">
      {/* Background Banner with Crossfade & Fallback */}
      <div className="absolute inset-0">
        <AnimePoster
          src={currentAnime.bannerUrl}
          alt={currentAnime.title}
          title={currentAnime.title}
          originalTitle={currentAnime.originalTitle}
          rating={currentAnime.rating}
          accentColor={currentAnime.accentColor}
          className="w-full h-full object-cover"
        />
        {/* Measured Scrim Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 font-medium">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {currentAnime.rating.toFixed(1)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentAnime.year}</span>
            <span aria-hidden="true">·</span>
            <span>{currentAnime.season}</span>
            <span aria-hidden="true">·</span>
            <span>{currentAnime.studio}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-400">{currentAnime.genres.join(' / ')}</span>
            {currentAnime.hasUzbekDub && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#F47521] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  O'zbekcha Dublyaj
                </span>
              </>
            )}
          </div>

          {/* Title in Characterful Display Face */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance drop-shadow-md">
              {currentAnime.title}
            </h1>
            <p className="text-sm font-light text-neutral-400 mt-1 tracking-wide">
              {currentAnime.originalTitle}
            </p>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 leading-relaxed max-w-xl">
            {currentAnime.synopsisUz}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlayAnime(currentAnime, 1)}
              className="px-6 py-3 bg-[#F47521] hover:bg-[#FF8533] text-black font-extrabold rounded-lg flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-[#F47521]/25 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>1-qismni tomosha qilish</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(currentAnime)}
              className={`px-4 py-3 rounded-lg border text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                inList
                  ? 'border-[#F47521]/60 bg-[#F47521]/10 text-[#F47521]'
                  : 'border-[#232732] bg-[#141519]/80 hover:bg-[#1E232F] text-white'
              }`}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inList ? "Ro'yxatda bor" : "Ro'yxatga qo'shish"}</span>
            </button>

            <button
              onClick={() => onOpenDetails(currentAnime)}
              className="px-4 py-3 rounded-lg border border-[#232732] bg-[#141519]/80 hover:bg-[#1E232F] text-neutral-300 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Info className="w-4 h-4" />
              <span>Batafsil ma'lumot</span>
            </button>

            {isAdmin && onEditAnime && (
              <button
                onClick={() => onEditAnime(currentAnime)}
                className="px-4 py-3 rounded-lg border border-amber-500/60 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Animeni tahrirlash (qismlar soni va rasm)"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Animeni sozlash</span>
              </button>
            )}
          </div>

        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute right-4 sm:right-8 bottom-16 flex items-center gap-2 z-20">
          {featuredAnimes.map((anime, idx) => (
            <button
              key={anime.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Anime ${anime.title} ga o'tish`}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-[#F47521]' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
