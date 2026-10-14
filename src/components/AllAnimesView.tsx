import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Sparkles,
  Tv,
  Film,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Anime, Genre } from '../types/anime';
import { AnimeCard } from './AnimeCard';
import { useAuth } from '../context/AuthContext';

interface AllAnimesViewProps {
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
  isInWatchlist: (id: string) => boolean;
  onToggleWatchlist: (e: React.MouseEvent, anime: Anime) => void;
  onEditAnime?: (anime: Anime) => void;
  onOpenAddAnime: () => void;
  initialGenre?: string;
  initialDubOnly?: boolean;
}

const ALPHABET = [
  'Barchasi',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0-9',
];

const GENRE_OPTIONS: (Genre | 'Barchasi')[] = [
  'Barchasi',
  'Shounen',
  'Jangari',
  'Fantastika',
  'Komediya',
  'Isekai',
  'Romantika',
  'Psixologik',
  "G'ayritabiiy",
  'Drama',
];

export const AllAnimesView: React.FC<AllAnimesViewProps> = ({
  animes,
  onSelectAnime,
  onPlayAnime,
  isInWatchlist,
  onToggleWatchlist,
  onEditAnime,
  onOpenAddAnime,
  initialGenre = 'Barchasi',
  initialDubOnly = false,
}) => {
  const { isAdmin, isOwner } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('Barchasi');
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [dubFilter, setDubFilter] = useState<'all' | 'dub' | 'sub'>(initialDubOnly ? 'dub' : 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Davom etmoqda' | 'Tugallangan'>('all');
  const [sortBy, setSortBy] = useState<
    'alphabetical' | 'alphabetical-desc' | 'rating' | 'newest' | 'episodes-desc' | 'episodes-asc'
  >('alphabetical');

  // Filter and sort all animes
  const filteredAnimes = useMemo(() => {
    return animes
      .filter((anime) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = anime.title.toLowerCase().includes(q);
          const matchesOriginal = anime.originalTitle.toLowerCase().includes(q);
          const matchesStudio = anime.studio.toLowerCase().includes(q);
          const matchesSynopsis = anime.synopsisUz.toLowerCase().includes(q);
          if (!matchesTitle && !matchesOriginal && !matchesStudio && !matchesSynopsis) {
            return false;
          }
        }

        // Alphabet letter filter
        if (selectedLetter !== 'Barchasi') {
          const firstChar = (anime.title.trim()[0] || '').toUpperCase();
          if (selectedLetter === '0-9') {
            if (!/^[0-9]/.test(firstChar)) return false;
          } else {
            if (firstChar !== selectedLetter) return false;
          }
        }

        // Genre filter
        if (selectedGenre !== 'Barchasi') {
          if (!anime.genres.includes(selectedGenre as Genre)) return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (anime.status !== statusFilter) return false;
        }

        // Voice dub filter
        if (dubFilter === 'dub' && !anime.hasUzbekDub) return false;
        if (dubFilter === 'sub' && !anime.hasUzbekSub) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'alphabetical-desc') {
          return b.title.localeCompare(a.title);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'newest') {
          return b.year - a.year;
        }
        if (sortBy === 'episodes-desc') {
          return b.totalEpisodes - a.totalEpisodes;
        }
        if (sortBy === 'episodes-asc') {
          return a.totalEpisodes - b.totalEpisodes;
        }
        return 0;
      });
  }, [animes, searchQuery, selectedLetter, selectedGenre, statusFilter, dubFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLetter('Barchasi');
    setSelectedGenre('Barchasi');
    setDubFilter('all');
    setStatusFilter('all');
    setSortBy('alphabetical');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner Header with Add Anime CTA for Admin/Owner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#232732]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Tv className="w-7 h-7 text-[#F47521]" />
              <span>Barcha Animelar</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1C1F2B] border border-[#2B2F3D] text-amber-400">
              {animes.length} ta anime
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-2xl">
            Saytdagi barcha anime seriallar ro'yxati. Alifbo tartibida, reyting yoki qismlar soni bo'yicha qulay saralang.
          </p>
        </div>

        {/* Action Button: Add Anime moved to All Animes section as requested */}
        <div className="flex items-center gap-3">
          {(isAdmin || isOwner) && (
            <button
              onClick={onOpenAddAnime}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F47521] via-amber-500 to-orange-500 hover:opacity-95 text-black font-extrabold text-xs shadow-lg shadow-[#F47521]/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
              title="Saytga yangi anime kiritish"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Yangi Anime Qo'shish</span>
            </button>
          )}

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom, yaponcha yoki studiya..."
              className="w-full bg-[#141519] border border-[#232732] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
            />
          </div>
        </div>
      </div>

      {/* Alphabetical Order Bar (Alifbo tartibi navigatsiyasi) */}
      <div className="bg-[#141519] border border-[#232732] rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#F47521]" />
            Alifbo bo'yicha tezkor o'tish:
          </span>
          {selectedLetter !== 'Barchasi' && (
            <button
              onClick={() => setSelectedLetter('Barchasi')}
              className="text-[#F47521] hover:underline font-medium text-[11px] cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Barchasini ko'rsatish
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 pt-1">
          {ALPHABET.map((char) => {
            const isSelected = selectedLetter === char;
            return (
              <button
                key={char}
                onClick={() => setSelectedLetter(char)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#F47521] text-black shadow-md font-black scale-105'
                    : 'bg-[#1C1F2B] text-neutral-300 hover:bg-[#282C3D] hover:text-white border border-[#2B2F3D]/60'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sorting Controls Bar */}
      <div className="space-y-3">
        
        {/* Genre Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {GENRE_OPTIONS.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-amber-500 text-black shadow-sm font-bold'
                  : 'bg-[#141519] border border-[#232732] text-neutral-400 hover:text-white hover:border-neutral-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Sorting and Voice Dub Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#141519] border border-[#232732] rounded-xl text-xs">
          
          {/* Voice Dub Filter */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Ovoz:</span>
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Holati:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#0B0C0E] border border-[#232732] text-white rounded-lg px-2.5 py-1 text-xs focus:outline-hidden focus:border-[#F47521] cursor-pointer"
            >
              <option value="all">Barchasi</option>
              <option value="Davom etmoqda">Davom etmoqda</option>
              <option value="Tugallangan">Tugallangan</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Tartiblash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B0C0E] border border-[#232732] text-white rounded-lg px-2.5 py-1 text-xs focus:outline-hidden focus:border-[#F47521] cursor-pointer"
            >
              <option value="alphabetical">Alifbo bo'yicha (A — Z)</option>
              <option value="alphabetical-desc">Alifbo bo'yicha (Z — A)</option>
              <option value="rating">Eng yuqori reyting</option>
              <option value="newest">Yangi chiqqanlar (Yil bo'yicha)</option>
              <option value="episodes-desc">Qismlar soni ko'pdan kamga</option>
              <option value="episodes-asc">Qismlar soni kamdan ko'pga</option>
            </select>

            <span className="text-amber-400 font-mono font-bold pl-2 border-l border-[#232732]">
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
        <div className="text-center py-16 bg-[#141519] border border-[#232732] rounded-2xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1C1F2B] border border-[#2B2F3D] flex items-center justify-center text-amber-400 mx-auto">
            <Film className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-white">
              {selectedLetter !== 'Barchasi'
                ? `"${selectedLetter}" harfi bilan boshlanuvchi anime topilmadi`
                : "Hech qanday anime topilmadi"}
            </p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Alifbo ko'rsatkichini "Barchasi" ga o'tkazing yoki qidiruv so'zini tozalang.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#232732] hover:bg-[#2B2F3D] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Filtrlarni tozalash
            </button>

            {(isAdmin || isOwner) && (
              <button
                onClick={onOpenAddAnime}
                className="px-4 py-2 bg-[#F47521] text-black text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Yangi anime qo'shish</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
