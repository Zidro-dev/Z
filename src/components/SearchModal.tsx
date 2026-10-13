import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Headphones, Play, ArrowRight } from 'lucide-react';
import { Anime } from '../types/anime';
import { AnimePoster } from './AnimePoster';

interface SearchModalProps {
  animes: Anime[];
  onClose: () => void;
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  animes,
  onClose,
  onSelectAnime,
  onPlayAnime,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const popularTags = [
    'Solo Leveling',
    'Jujutsu Kaisen',
    'Demon Slayer',
    'Frieren',
    'Attack on Titan',
    'Chainsaw Man',
  ];

  const results = query.trim()
    ? animes.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.originalTitle.toLowerCase().includes(q) ||
          a.studio.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="relative w-full max-w-2xl bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#232732] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#F47521] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Anime nomi, janr yoki yaponcha nomini qidiring..."
            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-neutral-400 hover:text-white px-2 py-1 rounded bg-[#191B22] border border-[#232732] cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!query.trim() ? (
            <div>
              <p className="text-xs font-semibold text-neutral-400 mb-2">
                Ommabop qidiruvlar:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-lg bg-[#191B22] border border-[#232732] hover:border-[#F47521]/60 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              "{query}" bo'yicha hech qanday natija topilmadi.
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-neutral-400 font-medium">
                Topilgan anime seriallar ({results.length})
              </p>
              {results.map((anime) => (
                <div
                  key={anime.id}
                  onClick={() => {
                    onSelectAnime(anime);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#191B22] hover:bg-[#1E232F] border border-[#232732] hover:border-[#F47521]/40 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 aspect-[3/4] rounded overflow-hidden bg-black shrink-0">
                      <AnimePoster
                        src={anime.posterUrl}
                        alt={anime.title}
                        title={anime.title}
                        accentColor={anime.accentColor}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#F47521] line-clamp-1 transition-colors">
                        {anime.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                        <span className="flex items-center text-amber-400 font-semibold">
                          <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                          {anime.rating.toFixed(1)}
                        </span>
                        <span>·</span>
                        <span>{anime.year}</span>
                        <span>·</span>
                        <span>{anime.genres.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {anime.hasUzbekDub && (
                      <span className="text-[10px] font-bold text-[#F47521] bg-[#F47521]/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <Headphones className="w-3 h-3" />
                        DUB
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayAnime(anime);
                        onClose();
                      }}
                      className="p-2 bg-[#F47521] text-black hover:bg-[#FF8533] rounded-lg transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
