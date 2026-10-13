import React from 'react';
import { X, Check, Sparkles, Flame, Shield, Zap, Download } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMegaFan: boolean;
  onToggleMegaFan: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isMegaFan,
  onToggleMegaFan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white hover:bg-[#1E232F] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#F47521] to-amber-400 text-black shadow-lg shadow-[#F47521]/25">
            <Flame className="w-8 h-8 fill-black" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            AniRoll <span className="text-[#F47521]">Mega Fan</span> Pass
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
            Anime olamiga to'liq cheklovlarsiz sho'ng'ing. Yangi qismlarni birinchilar qatorida tomosha qiling.
          </p>
        </div>

        {/* Perks list */}
        <div className="space-y-3 bg-[#191B22] p-4 rounded-xl border border-[#232732] text-xs">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-[#F47521]/15 text-[#F47521] mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-white">Mutlaqo Reklamasiz</p>
              <p className="text-neutral-400">Hech qanday kutilmagan reklamalar videosiz uzluksiz tomosha.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-[#F47521]/15 text-[#F47521] mt-0.5">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-white">Simulcast: Yaponiya bilan bir vaqtda</p>
              <p className="text-neutral-400">Tokioda efirga uzatilgandan so'ng 1 soat ichida yangi qismlar.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-[#F47521]/15 text-[#F47521] mt-0.5">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-white">Eksklyuziv O'zbekcha Dublyaj</p>
              <p className="text-neutral-400">Professional dublyaj jamoasining premyera qismlari sizga tezroq taqdim etiladi.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-[#F47521]/15 text-[#F47521] mt-0.5">
              <Download className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-white">1080p / 4K Ultra HD & Oflayn rejim</p>
              <p className="text-neutral-400">Kristaldek tiniq tasvir va qurilmaga yuklab olish imkoniyati.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onToggleMegaFan();
              onClose();
            }}
            className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              isMegaFan
                ? 'bg-[#1E232F] text-neutral-300 border border-neutral-700 hover:border-red-500 hover:text-red-400'
                : 'bg-gradient-to-r from-[#F47521] to-[#FF8533] text-black shadow-[#F47521]/25 hover:brightness-105'
            }`}
          >
            {isMegaFan ? (
              <span>Mega Fan obunasini bekor qilish</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black" />
                <span>14 Kunlik Bepul Sinovni Boshlash</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-neutral-500 text-center">
            {isMegaFan
              ? "Siz hozirda faol AniRoll Mega Fan a'zosisiz."
              : "Sinov muddati tugagandan so'ng oyiga 29,000 so'm. Istalgan vaqtda bekor qilish mumkin."}
          </p>
        </div>

      </div>
    </div>
  );
};
