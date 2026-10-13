import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'catalog' | 'simulcast' | 'watchlist' | 'top') => void;
  onOpenPremium: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenPremium }) => {
  return (
    <footer className="bg-[#0A0B0E] border-t border-[#232732] mt-16 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Wordmark & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#F47521] flex items-center justify-center font-black text-black">
                <span className="text-sm">⚡</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Ani<span className="text-[#F47521]">Roll</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              Crunchyroll uslubidagi zamonaviy anime oqimli platformasi. Sevimli anime seriallaringizni o'zbekcha ovoz va subtitrlarda zavq bilan tomosha qiling.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">
              Navigatsiya
            </p>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bosh sahifa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Katalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('simulcast')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Haftalik Yangi Qismlar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('top')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Top Reyting
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tariflar va Xizmatlar */}
          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">
              Obuna va Xizmatlar
            </p>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={onOpenPremium}
                  className="text-[#F47521] hover:underline font-semibold cursor-pointer"
                >
                  AniRoll Mega Fan Pass
                </button>
              </li>
              <li className="hover:text-white">Simulcast jadvali</li>
              <li className="hover:text-white">O'zbekcha dublyaj jamoasi</li>
              <li className="hover:text-white">Qo'llab-quvvatlash xizmati</li>
            </ul>
          </div>

          {/* Col 4: Huquqiy */}
          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">
              Huquqiy ma'lumotlar
            </p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Barcha anime qahramonlari, kadrlari va savdo belgilari tegishli studiyalar va mualliflik huquqi egalariga tegishli.
            </p>
            <div className="pt-2 text-[11px] text-neutral-500 font-mono">
              Toshkent, O'zbekiston · 2026 AniRoll
            </div>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-[#1C1F28] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 AniRoll. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 cursor-pointer">Foydalanish shartlari</span>
            <span>·</span>
            <span className="hover:text-neutral-400 cursor-pointer">Maxfiylik siyosati</span>
            <span>·</span>
            <span className="hover:text-neutral-400 cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
