import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Anime, Genre } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface CatalogViewProps {
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
  isInWatchlist: (id: string) => boolean;
  onToggleWatchlist: (e: React.MouseEvent, anime: Anime) => void;
  onEditAnime?: (anime: Anime) => void;
  initialGenre?: string;
  initialDubOnly?: boolean;
}

const GENRE_OPTIONS: (Genre | 'Barchasi')[] = [
  'Barchasi',
  'Jangari',
  'Shounen',
  'Fantastika',
  'Isekai',
  'Romantika',
  'Psixologik',
  'Komediya',
  "G'ayritabiiy",
  'Drama',
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  animes,
  onSelectAnime,
  onPlayAnime,
  isInWatchlist,
  onToggleWatchlist,
  onEditAnime,
  initialGenre = 'Barchasi',
  initialDubOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [dubFilter, setDubFilter] = useState<'all' | 'dub' | 'sub'>(initialDubOnly ? 'dub' : 'all');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'alphabetical'>('rating');

  const filteredAnimes = useMemo(() => {
    return animes
      .filter((anime) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = anime.title.toLowerCase().includes(q);
          const matchesOriginal = anime.originalTitle.toLowerCase().includes(q);
          const matchesStudio = anime.studio.toLowerCase().includes(q);
          if (!matchesTitle && !matchesOriginal && !matchesStudio) return false;
        }

        // Genre filter
        if (selectedGenre !== 'Barchasi') {
          if (!anime.genres.includes(selectedGenre as Genre)) return false;
        }

        // Voice dub filter
        if (dubFilter === 'dub' && !anime.hasUzbekDub) return false;
        if (dubFilter === 'sub' && !anime.hasUzbekSub) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.year - a.year;
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [animes, searchQuery, selectedGenre, dubFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#232732]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Anime Katalogi
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Barcha mashhur va yangi fasl animelari, o'zbekcha dublyaj va subtitrlarda.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Anime nomi yoki studiyani qidiring..."
            className="w-full bg-[#141519] border border-[#232732] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
          />
        </div>
      </div>

      {/* Interactive Filter Bars (Buttons/Tabs per Section 1.A) */}
      <div className="space-y-4">
        
        {/* Genre Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {GENRE_OPTIONS.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-[#F47521] text-black shadow-sm font-bold'
                  : 'bg-[#141519] border border-[#232732] text-neutral-400 hover:text-white hover:border-neutral-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Sub-Filters & Sorter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#141519] border border-[#232732] rounded-xl text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Ovoz turi:</span>
            <div className="flex items-center gap-1 bg-[#0B0C0E] p-1 rounded-lg border border-[#232732]">
              <button
                onClick={() => setDubFilter('all')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  dubFilter === 'all'
                    ? 'bg-[#232732] text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Barchasi
              </button>
              <button
                onClick={() => setDubFilter('dub')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  dubFilter === 'dub'
                    ? 'bg-[#F47521] text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                O'zbekcha Dub
              </button>
              <button
                onClick={() => setDubFilter('sub')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  dubFilter === 'sub'
                    ? 'bg-[#232732] text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Subtitr
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B0C0E] border border-[#232732] text-white rounded-lg px-2.5 py-1 text-xs focus:outline-hidden focus:border-[#F47521] cursor-pointer"
            >
              <option value="rating">Reyting bo'yicha (Eng yuqori)</option>
              <option value="newest">Yangi chiqqanlar (Yil bo'yicha)</option>
              <option value="alphabetical">Alifbo bo'yicha (A-Z)</option>
            </select>

            <span className="text-neutral-500 font-mono pl-2">
              {filteredAnimes.length} ta natija
            </span>
          </div>

        </div>

      </div>

      {/* Grid of Animes */}
      {filteredAnimes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pt-2">
          {filteredAnimes.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              onSelect={onSelectAnime}
              onPlay={onPlayAnime}
              isInWatchlist={isInWatchlist(anime.id)}
              onToggleWatchlist={onToggleWatchlist}
              onEdit={onEditAnime}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#141519] border border-[#232732] rounded-2xl p-8 space-y-3">
          <p className="text-base font-bold text-white">Hech qanday anime topilmadi</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Qidiruv so'zini yoki tanlangan filtrlarni o'zgartirib ko'ring.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('Barchasi');
              setDubFilter('all');
            }}
            className="px-4 py-2 bg-[#F47521] text-black text-xs font-bold rounded-lg cursor-pointer"
          >
            Filtrlarni tozalash
          </button>
        </div>
      )}

    </div>
  );
};
