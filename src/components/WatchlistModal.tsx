import React, { useState } from 'react';
import { X, Bookmark, History, Play, Trash2, ArrowRight } from 'lucide-react';
import { Anime, WatchHistoryItem } from '../types/anime';
import { AnimePoster } from './AnimePoster';

interface WatchlistModalProps {
  watchlistIds: string[];
  animes: Anime[];
  watchHistory: WatchHistoryItem[];
  onClose: () => void;
  onPlayAnime: (anime: Anime, episodeNumber?: number, progressSec?: number) => void;
  onSelectAnime: (anime: Anime) => void;
  onRemoveFromWatchlist: (id: string) => void;
  onClearHistory: () => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  watchlistIds,
  animes,
  watchHistory,
  onClose,
  onPlayAnime,
  onSelectAnime,
  onRemoveFromWatchlist,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history'>('watchlist');

  const watchlistAnimes = animes.filter((a) => watchlistIds.includes(a.id));

  const historyWithAnime = watchHistory
    .map((item) => {
      const anime = animes.find((a) => a.id === item.animeId);
      return {
        ...item,
        anime,
      };
    })
    .filter((item): item is WatchHistoryItem & { anime: Anime } => !!item.anime);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#232732] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F47521]/15 text-[#F47521] flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Shaxsiy Ro'yxat</h2>
              <p className="text-xs text-neutral-400">Saqlangan seriallar va tomosha tarixi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1E232F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-3 bg-[#191B22] border-b border-[#232732] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'watchlist'
                ? 'bg-[#F47521] text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saqlanganlar ({watchlistAnimes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#F47521] text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Tomosha tarixi ({historyWithAnime.length})</span>
          </button>

          {activeTab === 'history' && historyWithAnime.length > 0 && (
            <button
              onClick={onClearHistory}
              className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Tarixni tozalash</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'watchlist' ? (
            watchlistAnimes.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Bookmark className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-sm font-bold text-white">Ro'yxatingiz bo'sh</p>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Katalogdagi istalgan animening "+ Ro'yxatga qo'shish" tugmasini bosib shu yerda saqlang.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {watchlistAnimes.map((anime) => (
                  <div
                    key={anime.id}
                    className="p-3 bg-[#191B22] border border-[#232732] rounded-xl flex gap-3 items-center justify-between group"
                  >
                    <div
                      onClick={() => onSelectAnime(anime)}
                      className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    >
                      <div className="w-14 aspect-[3/4] rounded-md overflow-hidden shrink-0">
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
                        <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                          {anime.season} · {anime.rating.toFixed(1)} ★
                        </p>
                        <p className="text-[10px] text-emerald-400 mt-1">
                          {anime.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onPlayAnime(anime, 1)}
                        aria-label="Tomosha qilish"
                        className="p-2 bg-[#F47521] text-black hover:bg-[#FF8533] rounded-lg transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                      </button>
                      <button
                        onClick={() => onRemoveFromWatchlist(anime.id)}
                        aria-label="O'chirish"
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-[#232732] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* History Tab */
            historyWithAnime.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <History className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-sm font-bold text-white">Tomosha tarixi mavjud emas</p>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Anime qismlarini tomosha qilganingizda to'xtatilgan joyingiz avtomatik saqlanib boradi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyWithAnime.map((item) => {
                  const progressPct = Math.min(
                    100,
                    Math.round((item.progressSec / (item.durationSec || 1440)) * 100)
                  );
                  return (
                    <div
                      key={`${item.animeId}-${item.episodeNumber}`}
                      className="p-3 bg-[#191B22] border border-[#232732] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onSelectAnime(item.anime)}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <div className="w-16 aspect-video rounded-md overflow-hidden bg-black shrink-0 relative">
                          <AnimePoster
                            src={item.anime.bannerUrl}
                            alt={item.anime.title}
                            title={item.anime.title}
                            accentColor={item.anime.accentColor}
                            className="w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {item.anime.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {item.episodeNumber}-qism · {progressPct}% tomosha qilindi
                          </p>

                          {/* Progress bar */}
                          <div className="w-full max-w-xs h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-[#F47521]"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          onPlayAnime(item.anime, item.episodeNumber, item.progressSec)
                        }
                        className="px-3.5 py-2 bg-[#F47521] hover:bg-[#FF8533] text-black text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Davom ettirish</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};
