import React from 'react';
import { X, Play, Plus, Check, Star, ShieldCheck, Film, Calendar, Users, Share2, Sparkles, Sliders } from 'lucide-react';
import { Anime, Episode } from '../types/anime';
import { AnimePoster } from './AnimePoster';
import { useAuth } from '../context/AuthContext';

interface AnimeDetailsModalProps {
  anime: Anime;
  onClose: () => void;
  onPlayEpisode: (anime: Anime, episodeNumber: number) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  relatedAnimes: Anime[];
  onSelectRelated: (anime: Anime) => void;
  onEditAnime?: (anime: Anime) => void;
}

export const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({
  anime,
  onClose,
  onPlayEpisode,
  isInWatchlist,
  onToggleWatchlist,
  relatedAnimes,
  onSelectRelated,
  onEditAnime,
}) => {
  const { isAdmin } = useAuth();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="relative w-full max-w-4xl bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#F47521] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
          <AnimePoster
            src={anime.bannerUrl}
            alt={anime.title}
            title={anime.title}
            originalTitle={anime.originalTitle}
            rating={anime.rating}
            accentColor={anime.accentColor}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141519] via-[#141519]/70 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6 z-10">
            {/* Mini Poster */}
            <div className="hidden sm:block w-32 aspect-[3/4] rounded-lg overflow-hidden border-2 border-[#232732] shadow-xl shrink-0">
              <AnimePoster
                src={anime.posterUrl}
                alt={anime.title}
                title={anime.title}
                originalTitle={anime.originalTitle}
                accentColor={anime.accentColor}
                className="w-full h-full"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 font-medium">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {anime.rating.toFixed(1)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{anime.ratingCount} baho</span>
                <span aria-hidden="true">·</span>
                <span>{anime.year}</span>
                <span aria-hidden="true">·</span>
                <span>{anime.season}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#F47521] font-semibold">{anime.ageRating}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {anime.title}
              </h2>
              <p className="text-xs text-neutral-400">
                {anime.originalTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-6 border-b border-[#232732] flex flex-wrap items-center justify-between gap-4 bg-[#191B22]/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlayEpisode(anime, 1)}
              className="px-6 py-2.5 bg-[#F47521] hover:bg-[#FF8533] text-black font-extrabold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-[#F47521]/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>1-qismni boshlash</span>
            </button>

            <button
              onClick={onToggleWatchlist}
              className={`px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                isInWatchlist
                  ? 'border-[#F47521] bg-[#F47521]/15 text-[#F47521]'
                  : 'border-[#232732] bg-[#1E232F] hover:bg-[#2A3142] text-white'
              }`}
            >
              {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isInWatchlist ? "Ro'yxatda saqlangan" : "Ro'yxatga qo'shish"}</span>
            </button>
            {isAdmin && onEditAnime && (
              <button
                onClick={() => onEditAnime(anime)}
                className="px-4 py-2.5 rounded-lg border border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                title="Qismlar soni va rasmni sozlash"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Animeni tahrirlash</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            {anime.hasUzbekDub && (
              <span className="flex items-center gap-1 text-[#F47521] font-bold">
                <ShieldCheck className="w-4 h-4" />
                O'zbekcha Dublyaj mavjud
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-6">
          {/* Synopsis */}
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-2">
              Syujet tavsifi
            </h3>
            <p className="text-sm text-neutral-200 leading-relaxed">
              {anime.synopsisUz}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#191B22] border border-[#232732] text-xs">
            <div>
              <p className="text-neutral-500 font-semibold mb-0.5">Studiya</p>
              <p className="text-white font-medium">{anime.studio}</p>
            </div>
            <div>
              <p className="text-neutral-500 font-semibold mb-0.5">Janrlar</p>
              <p className="text-white font-medium">{anime.genres.join(', ')}</p>
            </div>
            <div>
              <p className="text-neutral-500 font-semibold mb-0.5">Holati</p>
              <p className="text-emerald-400 font-medium">{anime.status}</p>
            </div>
            <div>
              <p className="text-neutral-500 font-semibold mb-0.5">Jami qismlar</p>
              <p className="text-white font-mono font-medium">{anime.totalEpisodes} ta qism</p>
            </div>
          </div>

          {/* Episodes List Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Qismlar ro'yxati</span>
                <span className="text-xs font-mono font-normal text-[#F47521] bg-[#F47521]/10 px-2 py-0.5 rounded-full border border-[#F47521]/20">
                  {anime.episodes.length} ta qism mavjud
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {anime.episodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => onPlayEpisode(anime, ep.episodeNumber)}
                  className="p-3 bg-[#191B22] hover:bg-[#1E232F] border border-[#232732] hover:border-[#F47521]/50 rounded-xl flex gap-3 transition-colors cursor-pointer group"
                >
                  <div className="relative w-24 aspect-video rounded-md overflow-hidden bg-black shrink-0">
                    <img
                      src={ep.thumbnail}
                      alt={ep.titleUz}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-[#F47521] line-clamp-1 transition-colors">
                      {ep.episodeNumber}-qism: {ep.titleUz}
                    </p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {ep.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-500 font-mono">
                      <span>{ep.duration}</span>
                      <span>·</span>
                      <span>{ep.releaseDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Recommended Anime */}
          {relatedAnimes.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                O'xshash anime tavsiyalari
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedAnimes.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-2 bg-[#191B22] hover:bg-[#1E232F] rounded-lg border border-[#232732] cursor-pointer group transition-all"
                  >
                    <div className="aspect-[3/4] rounded overflow-hidden mb-2">
                      <AnimePoster
                        src={rel.posterUrl}
                        alt={rel.title}
                        title={rel.title}
                        accentColor={rel.accentColor}
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-[#F47521] line-clamp-1 transition-colors">
                      {rel.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {rel.genres[0]} · {rel.rating.toFixed(1)} ★
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
