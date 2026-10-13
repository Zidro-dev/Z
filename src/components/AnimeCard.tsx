import React from 'react';
import { Star, Plus, Check, Play, Headphones, Subtitles, Sliders } from 'lucide-react';
import { Anime } from '../types/anime';
import { AnimePoster } from './AnimePoster';
import { useAuth } from '../context/AuthContext';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
  onPlay: (anime: Anime) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (e: React.MouseEvent, anime: Anime) => void;
  onEdit?: (anime: Anime) => void;
  compact?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onSelect,
  onPlay,
  isInWatchlist,
  onToggleWatchlist,
  onEdit,
  compact = false,
}) => {
  const { isAdmin } = useAuth();

  return (
    <div
      onClick={() => onSelect(anime)}
      className="group relative flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* Poster Container */}
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#141519] border border-[#232732] group-hover:border-[#F47521]/60 transition-colors">
        <AnimePoster
          src={anime.posterUrl}
          alt={anime.title}
          title={anime.title}
          originalTitle={anime.originalTitle}
          rating={anime.rating}
          accentColor={anime.accentColor}
          className="w-full h-full"
        />

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 z-20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-neutral-300 bg-black/70 px-2 py-0.5 rounded">
              {anime.season}
            </span>
            <div className="flex items-center gap-1.5">
              {isAdmin && onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(anime);
                  }}
                  title="Animeni tahrirlash (qismlar soni va rasm)"
                  aria-label="Animeni tahrirlash"
                  className="p-1.5 rounded-full bg-amber-500/80 hover:bg-amber-400 text-black transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => onToggleWatchlist(e, anime)}
                aria-label={isInWatchlist ? "Ro'yxatdan o'chirish" : "Ro'yxatga qo'shish"}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isInWatchlist
                    ? 'bg-[#F47521] text-black'
                    : 'bg-black/80 text-white hover:bg-[#F47521] hover:text-black'
                }`}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(anime);
              }}
              className="w-12 h-12 rounded-full bg-[#F47521] text-black flex items-center justify-center transform scale-90 group-hover:scale-100 hover:bg-[#FF8533] transition-all shadow-lg cursor-pointer"
            >
              <Play className="w-6 h-6 fill-black translate-x-0.5" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-neutral-200 font-bold font-mono tabular-nums">
              Jami: {anime.totalEpisodes} qism ({anime.episodes.length} qism ochiq)
            </p>
          </div>
        </div>

        {/* Top Badges (Dub & Sub quiet markers) */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          {anime.hasUzbekDub && (
            <span className="bg-black/80 backdrop-blur-xs text-[#F47521] border border-[#F47521]/40 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <Headphones className="w-3 h-3" />
              DUB
            </span>
          )}
          {anime.hasUzbekSub && !anime.hasUzbekDub && (
            <span className="bg-black/80 backdrop-blur-xs text-neutral-200 border border-neutral-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <Subtitles className="w-3 h-3" />
              SUB
            </span>
          )}
        </div>
      </div>

      {/* Card Info Details (Zero-Pill Typography) */}
      <div className="mt-2.5 space-y-1">
        <h3 className="text-sm font-bold text-white group-hover:text-[#F47521] transition-colors line-clamp-1 leading-snug">
          {anime.title}
        </h3>

        {/* Quiet unboxed metadata */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
            <Star className="w-3 h-3 fill-amber-400" />
            {anime.rating.toFixed(1)}
          </span>
          <span aria-hidden="true">·</span>
          <span>{anime.genres[0]}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{anime.totalEpisodes} qism</span>
        </div>
      </div>
    </div>
  );
};
