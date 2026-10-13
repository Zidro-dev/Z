import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Anime } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface AnimeRowProps {
  title: string;
  subtitle?: string;
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
  isInWatchlist: (id: string) => boolean;
  onToggleWatchlist: (e: React.MouseEvent, anime: Anime) => void;
  onViewAll?: () => void;
}

export const AnimeRow: React.FC<AnimeRowProps> = ({
  title,
  subtitle,
  animes,
  onSelectAnime,
  onPlayAnime,
  isInWatchlist,
  onToggleWatchlist,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (animes.length === 0) return null;

  return (
    <section className="py-6 select-none">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-[#F47521] hover:text-[#FF8533] flex items-center gap-1 cursor-pointer transition-colors mr-2"
            >
              <span>Barchasini ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Oldingi animelarga o'tish"
              className="p-1.5 rounded-md bg-[#191B22] border border-[#232732] hover:border-neutral-500 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Keyingi animelarga o'tish"
              className="p-1.5 rounded-md bg-[#191B22] border border-[#232732] hover:border-neutral-500 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 scroll-smooth"
      >
        {animes.map((anime) => (
          <div
            key={anime.id}
            className="w-[170px] sm:w-[190px] md:w-[210px] shrink-0"
          >
            <AnimeCard
              anime={anime}
              onSelect={onSelectAnime}
              onPlay={onPlayAnime}
              isInWatchlist={isInWatchlist(anime.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
