/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AnimeRow } from './components/AnimeRow';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AnimeDetailsModal } from './components/AnimeDetailsModal';
import { CatalogView } from './components/CatalogView';
import { WatchlistModal } from './components/WatchlistModal';
import { SearchModal } from './components/SearchModal';
import { PremiumModal } from './components/PremiumModal';
import { SimulcastCalendar } from './components/SimulcastCalendar';
import { TopAnimeView } from './components/TopAnimeView';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { INITIAL_ANIME_LIST, INITIAL_COMMENTS } from './data/animeData';
import { Anime, UserComment, WatchHistoryItem } from './types/anime';
import { Sparkles, Flame, CheckCircle } from 'lucide-react';

function AniRollApp() {
  const { user, profile, updateUserProfile } = useAuth();

  const [animes] = useState<Anime[]>(INITIAL_ANIME_LIST);
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'simulcast' | 'watchlist' | 'top'>('home');
  const [catalogGenre, setCatalogGenre] = useState<string>('Barchasi');
  const [catalogDubOnly, setCatalogDubOnly] = useState<boolean>(false);

  // Watchlist persisted state
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aniroll_watchlist');
      return saved ? JSON.parse(saved) : ['solo-leveling', 'frieren'];
    } catch {
      return ['solo-leveling', 'frieren'];
    }
  });

  // Watch history persisted state
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('aniroll_history');
      return saved
        ? JSON.parse(saved)
        : [
            {
              animeId: 'solo-leveling',
              episodeNumber: 1,
              progressSec: 540,
              durationSec: 1420,
              lastWatchedAt: Date.now() - 3600000,
            },
          ];
    } catch {
      return [];
    }
  });

  // Comments persisted state
  const [comments, setComments] = useState<UserComment[]>(() => {
    try {
      const saved = localStorage.getItem('aniroll_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Mega Fan subscription state (synced with profile if available)
  const [isMegaFan, setIsMegaFan] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aniroll_megafan') === 'true';
    } catch {
      return false;
    }
  });

  // Modals state
  const [activePlayback, setActivePlayback] = useState<{
    anime: Anime;
    episodeNumber: number;
    progressSec: number;
  } | null>(null);

  const [selectedAnimeDetails, setSelectedAnimeDetails] = useState<Anime | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync profile Mega Fan status
  useEffect(() => {
    if (profile?.isMegaFan !== undefined) {
      setIsMegaFan(profile.isMegaFan);
    }
  }, [profile?.isMegaFan]);

  // Persist watchlist changes
  useEffect(() => {
    try {
      localStorage.setItem('aniroll_watchlist', JSON.stringify(watchlistIds));
    } catch {}
  }, [watchlistIds]);

  // Persist history changes
  useEffect(() => {
    try {
      localStorage.setItem('aniroll_history', JSON.stringify(watchHistory));
    } catch {}
  }, [watchHistory]);

  // Persist comments changes
  useEffect(() => {
    try {
      localStorage.setItem('aniroll_comments', JSON.stringify(comments));
    } catch {}
  }, [comments]);

  // Persist Mega Fan changes
  useEffect(() => {
    try {
      localStorage.setItem('aniroll_megafan', isMegaFan ? 'true' : 'false');
    } catch {}
  }, [isMegaFan]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const isInWatchlist = (animeId: string) => watchlistIds.includes(animeId);

  const toggleWatchlist = (anime: Anime) => {
    setWatchlistIds((prev) => {
      const exists = prev.includes(anime.id);
      if (exists) {
        showToast(`"${anime.title}" ro'yxatdan o'chirildi`);
        return prev.filter((id) => id !== anime.id);
      } else {
        showToast(`"${anime.title}" ro'yxatga qo'shildi`);
        return [...prev, anime.id];
      }
    });
  };

  const handleToggleWatchlistFromCard = (e: React.MouseEvent, anime: Anime) => {
    e.stopPropagation();
    toggleWatchlist(anime);
  };

  const handlePlayAnime = (anime: Anime, episodeNumber: number = 1, progressSec: number = 0) => {
    setActivePlayback({
      anime,
      episodeNumber,
      progressSec,
    });
  };

  const handleSaveProgress = (
    animeId: string,
    episodeNumber: number,
    progressSec: number,
    durationSec: number
  ) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter(
        (item) => !(item.animeId === animeId && item.episodeNumber === episodeNumber)
      );
      return [
        {
          animeId,
          episodeNumber,
          progressSec,
          durationSec,
          lastWatchedAt: Date.now(),
        },
        ...filtered,
      ];
    });
  };

  const handleAddComment = (commentData: Omit<UserComment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: UserComment = {
      ...commentData,
      userName: profile?.displayName || "Siz (Anime Muxlisi)",
      userAvatar: profile?.displayName ? profile.displayName.slice(0, 2).toUpperCase() : 'SZ',
      id: `c-${Date.now()}`,
      createdAt: 'Hozirgina',
      likes: 0,
      userLiked: false,
      isMegaFan: isMegaFan || Boolean(profile?.isMegaFan),
    };
    setComments((prev) => [newComment, ...prev]);
    showToast("Izohingiz muvaffaqiyatli chop etildi!");
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = c.userLiked;
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
            userLiked: !isLiked,
          };
        }
        return c;
      })
    );
  };

  const handleToggleMegaFan = async () => {
    const next = !isMegaFan;
    setIsMegaFan(next);
    if (profile) {
      await updateUserProfile({ isMegaFan: next });
    }
    showToast(
      next
        ? "AniRoll Mega Fan a'zoligi faollashtirildi!"
        : "Mega Fan obunasi bekor qilindi."
    );
  };

  const featuredAnimes = animes.filter((a) => a.isFeatured);
  const trendingAnimes = animes.filter((a) => a.isTrending);
  const newReleaseAnimes = animes.filter((a) => a.isNewRelease);
  const uzDubAnimes = animes.filter((a) => a.hasUzbekDub);
  const shounenAnimes = animes.filter((a) => a.genres.includes('Shounen'));

  const navigateToCatalogWithFilter = (genre: string = 'Barchasi', dubOnly: boolean = false) => {
    setCatalogGenre(genre);
    setCatalogDubOnly(dubOnly);
    setCurrentTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F2F2F2] flex flex-col font-sans selection:bg-[#F47521] selection:text-black">
      
      {/* 3-Zone Top Navigation Bar with Profile Integration */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'watchlist') {
            setIsWatchlistOpen(true);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userProfile={profile}
        isMegaFan={isMegaFan}
        watchlistCount={watchlistIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-4">
            
            {/* Featured Hero Banner Spotlight */}
            <HeroBanner
              featuredAnimes={featuredAnimes.length > 0 ? featuredAnimes : animes.slice(0, 3)}
              onPlayAnime={handlePlayAnime}
              onOpenDetails={(anime) => setSelectedAnimeDetails(anime)}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
            />

            {/* Carousel Rails (Crunchyroll Style) */}
            <div className="space-y-2 -mt-6 sm:-mt-10 relative z-20">
              
              {/* Row 1: Trenddagi Mashhurlar */}
              <AnimeRow
                title="Trenddagi Mashhur Seriallar"
                subtitle="Ayni paytda eng ko'p ko'rilayotgan hit fasl premyeralari"
                animes={trendingAnimes}
                onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
                onPlayAnime={handlePlayAnime}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={handleToggleWatchlistFromCard}
                onViewAll={() => navigateToCatalogWithFilter('Barchasi')}
              />

              {/* Row 2: Yangi Chiqqan Qismlar (Simulcast) */}
              <AnimeRow
                title="Bugun Yangi Chiqqan Qismlar"
                subtitle="Yaponiyadan bir soat o'tgach efirga uzatilgan yangi seriyalar"
                animes={newReleaseAnimes}
                onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
                onPlayAnime={handlePlayAnime}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={handleToggleWatchlistFromCard}
                onViewAll={() => setCurrentTab('simulcast')}
              />

              {/* Mega Fan Promotional Ribbon */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative rounded-2xl bg-gradient-to-r from-[#1E232F] via-[#161822] to-[#12141C] border border-[#232732] p-6 sm:p-8 overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left z-10">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      AniRoll Mega Fan A'zoligi
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Barcha anime seriallarni reklamalarsiz va 1080p Ultra HD tomosha qiling
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                      14 kunlik bepul sinov muddatini yoqing va yangi qismlarni rasmiy o'zbekcha ovozda birinchilar qatorida qabul qiling.
                    </p>
                  </div>

                  <div className="shrink-0 z-10">
                    <button
                      onClick={() => setIsPremiumOpen(true)}
                      className="px-6 py-3 bg-[#F47521] hover:bg-[#FF8533] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#F47521]/20 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isMegaFan ? "Obunani boshqarish" : "14 kunlik sinovni boshlash"}
                    </button>
                  </div>
                </div>
              </section>

              {/* Row 3: O'zbekcha Dublyaj */}
              <AnimeRow
                title="O'zbekcha Dublyaj Saralari"
                subtitle="Professional o'zbek aktyorlari tomonidan ovoz berilgan xit asarlar"
                animes={uzDubAnimes}
                onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
                onPlayAnime={handlePlayAnime}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={handleToggleWatchlistFromCard}
                onViewAll={() => navigateToCatalogWithFilter('Barchasi', true)}
              />

              {/* Row 4: Shounen & Fantastika */}
              <AnimeRow
                title="Shounen & Fantastika Dunyosi"
                subtitle="Kuchli janglar, qahramonlik va sehrli olam sarguzashtlari"
                animes={shounenAnimes}
                onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
                onPlayAnime={handlePlayAnime}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={handleToggleWatchlistFromCard}
                onViewAll={() => navigateToCatalogWithFilter('Shounen')}
              />

            </div>

          </div>
        )}

        {/* Catalog Tab */}
        {currentTab === 'catalog' && (
          <CatalogView
            animes={animes}
            onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
            onPlayAnime={handlePlayAnime}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={handleToggleWatchlistFromCard}
            initialGenre={catalogGenre}
            initialDubOnly={catalogDubOnly}
          />
        )}

        {/* Simulcast Release Calendar Tab */}
        {currentTab === 'simulcast' && (
          <SimulcastCalendar
            animes={animes}
            onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
            onPlayAnime={handlePlayAnime}
          />
        )}

        {/* Top Rated Anime Tab */}
        {currentTab === 'top' && (
          <TopAnimeView
            animes={animes}
            onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
            onPlayAnime={handlePlayAnime}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={handleToggleWatchlistFromCard}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          if (tab === 'watchlist') {
            setIsWatchlistOpen(true);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenPremium={() => setIsPremiumOpen(true)}
      />

      {/* Video Player Modal */}
      {activePlayback && (
        <VideoPlayerModal
          anime={activePlayback.anime}
          initialEpisodeNumber={activePlayback.episodeNumber}
          initialProgressSec={activePlayback.progressSec}
          onClose={() => setActivePlayback(null)}
          onSaveProgress={handleSaveProgress}
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          isInWatchlist={isInWatchlist(activePlayback.anime.id)}
          onToggleWatchlist={() => toggleWatchlist(activePlayback.anime)}
        />
      )}

      {/* Anime Details Modal */}
      {selectedAnimeDetails && (
        <AnimeDetailsModal
          anime={selectedAnimeDetails}
          onClose={() => setSelectedAnimeDetails(null)}
          onPlayEpisode={(anime, epNum) => {
            setSelectedAnimeDetails(null);
            handlePlayAnime(anime, epNum);
          }}
          isInWatchlist={isInWatchlist(selectedAnimeDetails.id)}
          onToggleWatchlist={() => toggleWatchlist(selectedAnimeDetails)}
          relatedAnimes={animes.filter(
            (a) =>
              a.id !== selectedAnimeDetails.id &&
              a.genres.some((g) => selectedAnimeDetails.genres.includes(g))
          )}
          onSelectRelated={(related) => setSelectedAnimeDetails(related)}
        />
      )}

      {/* Watchlist Modal */}
      {isWatchlistOpen && (
        <WatchlistModal
          watchlistIds={watchlistIds}
          animes={animes}
          watchHistory={watchHistory}
          onClose={() => setIsWatchlistOpen(false)}
          onPlayAnime={(anime, epNum, prog) => {
            setIsWatchlistOpen(false);
            handlePlayAnime(anime, epNum || 1, prog || 0);
          }}
          onSelectAnime={(anime) => {
            setIsWatchlistOpen(false);
            setSelectedAnimeDetails(anime);
          }}
          onRemoveFromWatchlist={(id) => {
            setWatchlistIds((prev) => prev.filter((i) => i !== id));
            showToast("Ro'yxatdan o'chirildi");
          }}
          onClearHistory={() => {
            setWatchHistory([]);
            showToast("Tomosha tarixi tozalandi");
          }}
        />
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal
          animes={animes}
          onClose={() => setIsSearchOpen(false)}
          onSelectAnime={(anime) => setSelectedAnimeDetails(anime)}
          onPlayAnime={(anime) => handlePlayAnime(anime, 1)}
        />
      )}

      {/* Premium Mega Fan Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        isMegaFan={isMegaFan}
        onToggleMegaFan={handleToggleMegaFan}
      />

      {/* Authentication Modal (Login / Register / Google / Guest) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => showToast("Hisobingizga muvaffaqiyatli kirdingiz!")}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        watchlistCount={watchlistIds.length}
        historyCount={watchHistory.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191B22] border border-[#F47521]/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-[#F47521]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AniRollApp />
    </AuthProvider>
  );
}
