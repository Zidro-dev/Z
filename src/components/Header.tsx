import React from 'react';
import { Search, Bookmark, Sparkles, User, Flame } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'catalog' | 'simulcast' | 'watchlist' | 'top';
  onSelectTab: (tab: 'home' | 'catalog' | 'simulcast' | 'watchlist' | 'top') => void;
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  onOpenPremium: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  userProfile?: { displayName: string; avatar: string } | null;
  isMegaFan: boolean;
  watchlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenWatchlist,
  onOpenPremium,
  onOpenAuth,
  onOpenProfile,
  userProfile,
  isMegaFan,
  watchlistCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0C0E]/95 backdrop-blur-md border-b border-[#232732] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 group cursor-pointer text-left whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F47521] flex items-center justify-center font-black text-black shadow-md shadow-[#F47521]/20 group-hover:scale-105 transition-transform">
            <span className="text-xl leading-none">⚡</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-[#F47521] transition-colors">
            Ani<span className="text-[#F47521]">Roll</span>
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              currentTab === 'home'
                ? 'text-[#F47521] font-semibold border-b-2 border-[#F47521]'
                : 'text-neutral-400'
            }`}
          >
            Bosh sahifa
          </button>

          <button
            onClick={() => onSelectTab('catalog')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              currentTab === 'catalog'
                ? 'text-[#F47521] font-semibold border-b-2 border-[#F47521]'
                : 'text-neutral-400'
            }`}
          >
            Katalog
          </button>

          <button
            onClick={() => onSelectTab('simulcast')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              currentTab === 'simulcast'
                ? 'text-[#F47521] font-semibold border-b-2 border-[#F47521]'
                : 'text-neutral-400'
            }`}
          >
            Yangi qismlar
          </button>

          <button
            onClick={() => onSelectTab('top')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              currentTab === 'top'
                ? 'text-[#F47521] font-semibold border-b-2 border-[#F47521]'
                : 'text-neutral-400'
            }`}
          >
            Top reyting
          </button>

          <button
            onClick={onOpenWatchlist}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              currentTab === 'watchlist'
                ? 'text-[#F47521] font-semibold border-b-2 border-[#F47521]'
                : 'text-neutral-400'
            }`}
          >
            <span>Mening ro'yxatim</span>
            {watchlistCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-[#232732] text-neutral-200 px-1.5 py-0.2 rounded-full">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Search Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            aria-label="Anime qidirish"
            className="p-2 text-neutral-300 hover:text-white hover:bg-[#1A1C22] rounded-lg transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenWatchlist}
            aria-label="Saqlangan anime ro'yxati"
            className="md:hidden p-2 text-neutral-300 hover:text-white hover:bg-[#1A1C22] rounded-lg transition-colors cursor-pointer relative"
          >
            <Bookmark className="w-5 h-5" />
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F47521]" />
            )}
          </button>

          {/* User Profile or Sign In Button */}
          {userProfile ? (
            <button
              onClick={onOpenProfile}
              aria-label="Foydalanuvchi profili"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg bg-[#191B22] hover:bg-[#1E232F] border border-[#232732] hover:border-[#F47521]/60 transition-colors cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md overflow-hidden bg-black border border-neutral-700 shrink-0">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#F47521] line-clamp-1 max-w-[80px] sm:max-w-[110px] hidden sm:inline">
                {userProfile.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#232732] bg-[#191B22] hover:bg-[#1E232F] hover:border-neutral-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#F47521]" />
              <span>Kirish</span>
            </button>
          )}

          <button
            onClick={onOpenPremium}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isMegaFan
                ? 'bg-[#1E232F] text-amber-400 border border-amber-500/30'
                : 'bg-[#F47521] hover:bg-[#FF8533] text-black shadow-md shadow-[#F47521]/20 font-black'
            }`}
          >
            {isMegaFan ? (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                <span>Mega Fan</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 fill-black" />
                <span>Premium sinash</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
