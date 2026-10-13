import React from 'react';
import { Star, Trophy, Play, Plus, Check } from 'lucide-react';
import { Anime } from '../types/anime';
import { AnimePoster } from './AnimePoster';

interface TopAnimeViewProps {
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
  isInWatchlist: (id: string) => boolean;
  onToggleWatchlist: (e: React.MouseEvent, anime: Anime) => void;
}

export const TopAnimeView: React.FC<TopAnimeViewProps> = ({
  animes,
  onSelectAnime,
  onPlayAnime,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const sortedByRating = [...animes].sort((a, b) => b.rating - a.rating);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-[#232732]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Trophy className="w-7 h-7 text-amber-400" />
          <span>Top Anime Seriallar Reytingi</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Muxlislar va tanqidchilar baholari bo'yicha eng yuqori reytingli daho asarlar.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {sortedByRating.map((anime, index) => {
          const rankNumber = (index + 1).toString().padStart(2, '0');
          const inList = isInWatchlist(anime.id);

          return (
            <div
              key={anime.id}
              onClick={() => onSelectAnime(anime)}
              className="p-4 bg-[#141519] border border-[#232732] hover:border-[#F47521]/40 rounded-xl flex items-center gap-4 transition-all cursor-pointer group"
            >
              {/* Editorial Rank Number */}
              <div className="w-10 sm:w-12 text-center shrink-0">
                <span className={`text-xl sm:text-2xl font-black font-mono tabular-nums ${
                  index === 0
                    ? 'text-amber-400'
                    : index === 1
                    ? 'text-slate-300'
                    : index === 2
                    ? 'text-amber-600'
                    : 'text-neutral-500'
                }`}>
                  {rankNumber}
                </span>
              </div>

              {/* Poster */}
              <div className="w-14 sm:w-16 aspect-[3/4] rounded-lg overflow-hidden shrink-0 bg-black">
                <AnimePoster
                  src={anime.posterUrl}
                  alt={anime.title}
                  title={anime.title}
                  accentColor={anime.accentColor}
                  className="w-full h-full"
                />
              </div>

              {/* Title and details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F47521] line-clamp-1 transition-colors">
                    {anime.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                  {anime.originalTitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 font-medium">
                  <span>{anime.genres.join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{anime.studio}</span>
                  <span aria-hidden="true">·</span>
                  <span>{anime.year}</span>
                </div>
              </div>

              {/* Rating score */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191B22] border border-[#232732] shrink-0 text-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-black font-mono tabular-nums text-white">
                  {anime.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                  ({anime.ratingCount})
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => onToggleWatchlist(e, anime)}
                  aria-label={inList ? "Ro'yxatdan o'chirish" : "Ro'yxatga qo'shish"}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer hidden sm:block ${
                    inList
                      ? 'bg-[#F47521]/15 border-[#F47521] text-[#F47521]'
                      : 'bg-[#191B22] border-[#232732] text-neutral-400 hover:text-white'
                  }`}
                >
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAnime(anime);
                  }}
                  className="px-3.5 py-2 bg-[#F47521] hover:bg-[#FF8533] text-black text-xs font-black rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span className="hidden sm:inline">Ko'rish</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
