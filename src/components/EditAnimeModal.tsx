import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  Image as ImageIcon,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Tv,
  Film,
  Sparkles,
  Crown,
  Shield,
  Layers,
  Palette,
  Eye,
  Info,
} from 'lucide-react';
import { Anime } from '../types/anime';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ANIME_LIST } from '../data/animeData';

interface EditAnimeModalProps {
  anime: Anime | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAnime: Anime) => Promise<void> | void;
}

// Curated high-resolution anime posters for quick presets
const POPULAR_POSTER_PRESETS = [
  {
    title: 'Solo Leveling (Rasmiy)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png',
  },
  {
    title: 'Frieren (Rasmiy)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg',
  },
  {
    title: 'Jujutsu Kaisen (Gojo)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg',
  },
  {
    title: 'Demon Slayer (Kimetsu)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg',
  },
  {
    title: 'Attack on Titan (Eren)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg',
  },
  {
    title: 'Chainsaw Man (Denji)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-DdP4vAdssLoz.png',
  },
  {
    title: 'One Piece (Luffy)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-ELSYx3yMPcKM.jpg',
  },
  {
    title: 'Spy x Family (Anya)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx140960-Kb6R5nYQfjmP.jpg',
  },
  {
    title: 'Bleach: TYBW',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx114446-B4c6dO9v2JjF.jpg',
  },
  {
    title: 'DanDaDan (2024)',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171018-090w4q7hKq4Z.jpg',
  },
];

// Curated high-resolution anime banners for quick presets
const POPULAR_BANNER_PRESETS = [
  {
    title: 'Solo Leveling Banner',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg',
  },
  {
    title: 'Frieren Banner',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJrIL1P0C.jpg',
  },
  {
    title: 'Jujutsu Kaisen Banner',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-jQToEOInNO05.jpg',
  },
  {
    title: 'Demon Slayer Banner',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YBdSSsfZ7y6Y.jpg',
  },
  {
    title: 'Attack on Titan Banner',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg',
  },
  {
    title: 'Chainsaw Man Banner',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-Tdfpmw1c2P6J.jpg',
  },
  {
    title: 'Spy x Family Banner',
    url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/140960-478627341.jpg',
  },
];

export const EditAnimeModal: React.FC<EditAnimeModalProps> = ({
  anime,
  isOpen,
  onClose,
  onSave,
}) => {
  const { isOwner, isAdmin, profile } = useAuth();

  // Form states
  const [totalEpisodes, setTotalEpisodes] = useState<number>(12);
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [originalTitle, setOriginalTitle] = useState<string>('');
  const [synopsisUz, setSynopsisUz] = useState<string>('');
  const [status, setStatus] = useState<'Davom etmoqda' | 'Tugallangan'>('Davom etmoqda');
  const [season, setSeason] = useState<string>('');
  const [year, setYear] = useState<number>(2024);
  const [hasUzbekDub, setHasUzbekDub] = useState<boolean>(true);
  const [hasUzbekSub, setHasUzbekSub] = useState<boolean>(true);
  const [accentColor, setAccentColor] = useState<string>('#F47521');

  // Preview & feedback
  const [posterImgError, setPosterImgError] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active tab inside editor
  const [editorSection, setEditorSection] = useState<'episodes' | 'images' | 'info'>('episodes');

  // Initialize form when anime changes
  useEffect(() => {
    if (anime) {
      setTotalEpisodes(anime.totalEpisodes || 12);
      setPosterUrl(anime.posterUrl || '');
      setBannerUrl(anime.bannerUrl || '');
      setTitle(anime.title || '');
      setOriginalTitle(anime.originalTitle || '');
      setSynopsisUz(anime.synopsisUz || '');
      setStatus(anime.status || 'Davom etmoqda');
      setSeason(anime.season || '1-Mavsum');
      setYear(anime.year || 2024);
      setHasUzbekDub(Boolean(anime.hasUzbekDub));
      setHasUzbekSub(Boolean(anime.hasUzbekSub));
      setAccentColor(anime.accentColor || '#F47521');
      setPosterImgError(false);
      setBannerImgError(false);
      setSaveSuccess(false);
      setErrorMsg(null);
    }
  }, [anime, isOpen]);

  if (!isOpen || !anime) return null;

  // Find original baseline anime to allow reset
  const defaultAnime = INITIAL_ANIME_LIST.find((a) => a.id === anime.id);

  const handleResetToDefault = () => {
    if (!defaultAnime) return;
    setTotalEpisodes(defaultAnime.totalEpisodes);
    setPosterUrl(defaultAnime.posterUrl);
    setBannerUrl(defaultAnime.bannerUrl);
    setTitle(defaultAnime.title);
    setOriginalTitle(defaultAnime.originalTitle);
    setSynopsisUz(defaultAnime.synopsisUz);
    setStatus(defaultAnime.status);
    setSeason(defaultAnime.season);
    setYear(defaultAnime.year);
    setHasUzbekDub(defaultAnime.hasUzbekDub);
    setHasUzbekSub(defaultAnime.hasUzbekSub);
    setAccentColor(defaultAnime.accentColor);
    setPosterImgError(false);
    setBannerImgError(false);
  };

  const handleQuickAddEpisodes = (amount: number) => {
    setTotalEpisodes((prev) => Math.max(1, prev + amount));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setErrorMsg("Faqat Admin yoki Sayt Egasi animelarni tahrirlay oladi!");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Anime nomi bo'sh bo'lishi mumkin emas!");
      return;
    }

    if (totalEpisodes < 1) {
      setErrorMsg("Jami qismlar soni kamida 1 bo'lishi kerak!");
      return;
    }

    if (!posterUrl.trim()) {
      setErrorMsg("Anime poster rasmi havolasi kiritilishi shart!");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const updatedAnime: Anime = {
        ...anime,
        title: title.trim(),
        originalTitle: originalTitle.trim(),
        synopsisUz: synopsisUz.trim(),
        totalEpisodes: Number(totalEpisodes),
        posterUrl: posterUrl.trim(),
        bannerUrl: bannerUrl.trim() || posterUrl.trim(),
        status,
        season: season.trim() || '1-Mavsum',
        year: Number(year),
        hasUzbekDub,
        hasUzbekSub,
        accentColor: accentColor || '#F47521',
      };

      await onSave(updatedAnime);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || "Animeni saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#232732] flex items-center justify-between bg-[#191B22]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F47521]/15 border border-[#F47521]/30 flex items-center justify-center text-[#F47521]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Animeni tahrirlash
                </h2>
                {isOwner ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Owner
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-400" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 line-clamp-1">
                {anime.title} · ({anime.episodes.length} ta mavjud qism)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#232732] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-[#232732] flex items-center gap-2 bg-[#141519] shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setEditorSection('episodes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              editorSection === 'episodes'
                ? 'bg-[#F47521] text-black shadow-md shadow-[#F47521]/20'
                : 'bg-[#191B22] text-neutral-400 hover:text-white hover:bg-[#232732]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>1. Jami qismlar soni</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded font-mono text-[11px]">
              {totalEpisodes}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setEditorSection('images')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              editorSection === 'images'
                ? 'bg-[#F47521] text-black shadow-md shadow-[#F47521]/20'
                : 'bg-[#191B22] text-neutral-400 hover:text-white hover:bg-[#232732]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. Poster va Banner rasmlari</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorSection('info')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              editorSection === 'info'
                ? 'bg-[#F47521] text-black shadow-md shadow-[#F47521]/20'
                : 'bg-[#191B22] text-neutral-400 hover:text-white hover:bg-[#232732]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>3. Asosiy ma'lumotlar</span>
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-700/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Anime muvaffaqiyatli saqlandi va yangilandi!</span>
            </div>
          )}

          {/* TAB 1: TOTAL EPISODES MANAGEMENT */}
          {editorSection === 'episodes' && (
            <div className="space-y-5">
              <div className="bg-[#191B22] p-4 rounded-xl border border-[#232732] space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-200 mb-1">
                    Jami qismlar soni (Rejalashtirilgan / Jami qism)
                  </label>
                  <p className="text-[11px] text-neutral-400 mb-3">
                    Ushbu animening umumiy qancha qismdan iboratligini belgilang. Saytda "Jami: {totalEpisodes} qism" ko'rinishida namoyon bo'ladi.
                  </p>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={2000}
                      value={totalEpisodes}
                      onChange={(e) => setTotalEpisodes(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-32 bg-[#0F1014] border border-[#2A2E3D] focus:border-[#F47521] text-white px-3 py-2.5 rounded-lg text-lg font-bold font-mono text-center outline-none"
                    />

                    {/* Quick step buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickAddEpisodes(1)}
                        className="px-2.5 py-1.5 bg-[#232732] hover:bg-[#2E3342] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                      >
                        +1 qism
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAddEpisodes(5)}
                        className="px-2.5 py-1.5 bg-[#232732] hover:bg-[#2E3342] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                      >
                        +5 qism
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAddEpisodes(12)}
                        className="px-2.5 py-1.5 bg-[#232732] hover:bg-[#2E3342] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                      >
                        +12 qism
                      </button>
                      <button
                        type="button"
                        onClick={() => setTotalEpisodes(12)}
                        className="px-2.5 py-1.5 bg-[#232732] hover:bg-[#2E3342] text-neutral-300 text-xs font-mono rounded-md transition-colors cursor-pointer"
                      >
                        12 (standart)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTotalEpisodes(24)}
                        className="px-2.5 py-1.5 bg-[#232732] hover:bg-[#2E3342] text-neutral-300 text-xs font-mono rounded-md transition-colors cursor-pointer"
                      >
                        24 (mavsum)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTotalEpisodes(48)}
                        className="px-2.5 py-1.5 bg-[#232732] hover:bg-[#2E3342] text-neutral-300 text-xs font-mono rounded-md transition-colors cursor-pointer"
                      >
                        48
                      </button>
                      <button
                        type="button"
                        onClick={() => setTotalEpisodes(100)}
                        className="px-2.5 py-1.5 bg-[#232732] hover:bg-[#2E3342] text-neutral-300 text-xs font-mono rounded-md transition-colors cursor-pointer"
                      >
                        100+
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#232732] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-200 mb-1">
                      Anime Holati (Status)
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#0F1014] border border-[#2A2E3D] focus:border-[#F47521] text-white px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
                    >
                      <option value="Davom etmoqda">🟢 Davom etmoqda (Ongoing)</option>
                      <option value="Tugallangan">🏁 Tugallangan (Completed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-200 mb-1">
                      Hozirda yuklangan qismlar
                    </label>
                    <div className="bg-[#0F1014] border border-[#232732] px-3 py-2 rounded-lg text-xs font-mono text-neutral-300 flex items-center justify-between">
                      <span>{anime.episodes.length} ta ochiq qism</span>
                      <span className="text-[#F47521] font-bold">
                        {anime.episodes.length >= totalEpisodes
                          ? 'To‘liq chiqarilgan'
                          : `${totalEpisodes - anime.episodes.length} qism kutilmoqda`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Episode Progress Indicator Box */}
              <div className="p-4 rounded-xl bg-[#191B22]/60 border border-[#232732] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">
                    Ko'rinishi: "{anime.title}"
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Foydalanuvchilar kartada va tomosha oynasida ushbu umumiy qism sonini ko'radi.
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-black/80 border border-[#F47521]/40 text-[#F47521] font-mono font-bold text-xs rounded-full">
                    {anime.episodes.length} / {totalEpisodes} qism
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POSTER & BANNER IMAGES CUSTOMIZATION */}
          {editorSection === 'images' && (
            <div className="space-y-6">
              {/* Poster 3:4 */}
              <div className="bg-[#191B22] p-4 rounded-xl border border-[#232732] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-neutral-200">
                      1. Vertikal Poster Rasmi (3:4 nisbat)
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Katalogda, tavsiyalarda va anime kartalarida ko'rinadigan asosiy muqova rasmi.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Poster Preview */}
                  <div className="w-28 sm:w-32 aspect-[3/4] rounded-lg overflow-hidden bg-black border border-[#2A2E3D] shrink-0 relative group shadow-lg">
                    {posterUrl && !posterImgError ? (
                      <img
                        src={posterUrl}
                        alt="Poster preview"
                        referrerPolicy="no-referrer"
                        onError={() => setPosterImgError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-neutral-500 bg-neutral-900">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mb-1" />
                        <span className="text-[10px] leading-tight">Rasm yuklanmadi</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-[9px] text-neutral-300 font-mono">
                      3:4
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Poster URL havolasi:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://... rasm havolasi"
                          value={posterUrl}
                          onChange={(e) => {
                            setPosterUrl(e.target.value);
                            setPosterImgError(false);
                          }}
                          className="flex-1 bg-[#0F1014] border border-[#2A2E3D] focus:border-[#F47521] text-white px-3 py-2 rounded-lg text-xs outline-none font-mono"
                        />
                        {posterUrl && (
                          <a
                            href={posterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#232732] hover:bg-[#2E3342] text-neutral-300 hover:text-white rounded-lg transition-colors"
                            title="Havolani ochish"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Poster Presets */}
                    <div>
                      <p className="text-[11px] font-semibold text-neutral-400 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#F47521]" />
                        Tezkor rasmiy poster presetlari (Tanlash uchun bosing):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_POSTER_PRESETS.map((preset) => (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => {
                              setPosterUrl(preset.url);
                              setPosterImgError(false);
                            }}
                            className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                              posterUrl === preset.url
                                ? 'bg-[#F47521] text-black font-bold'
                                : 'bg-[#232732] text-neutral-300 hover:bg-[#2E3342]'
                            }`}
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner 16:9 */}
              <div className="bg-[#191B22] p-4 rounded-xl border border-[#232732] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-neutral-200">
                      2. Gorizontal Banner Rasmi (16:9 nisbat)
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Bosh sahifa yuqori bannerida va anime tafsilotlari sarlavhasida fon sifatida ishlatiladi.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Banner Preview */}
                  <div className="w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-black border border-[#2A2E3D] shrink-0 relative group shadow-lg">
                    {bannerUrl && !bannerImgError ? (
                      <img
                        src={bannerUrl}
                        alt="Banner preview"
                        referrerPolicy="no-referrer"
                        onError={() => setBannerImgError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-neutral-500 bg-neutral-900">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mb-1" />
                        <span className="text-[10px] leading-tight">Rasm yuklanmadi</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-[9px] text-neutral-300 font-mono">
                      16:9
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Banner URL havolasi:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://... gorizontal banner havolasi"
                          value={bannerUrl}
                          onChange={(e) => {
                            setBannerUrl(e.target.value);
                            setBannerImgError(false);
                          }}
                          className="flex-1 bg-[#0F1014] border border-[#2A2E3D] focus:border-[#F47521] text-white px-3 py-2 rounded-lg text-xs outline-none font-mono"
                        />
                        {bannerUrl && (
                          <a
                            href={bannerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#232732] hover:bg-[#2E3342] text-neutral-300 hover:text-white rounded-lg transition-colors"
                            title="Havolani ochish"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Banner Presets */}
                    <div>
                      <p className="text-[11px] font-semibold text-neutral-400 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#F47521]" />
                        Tezkor rasmiy banner presetlari:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_BANNER_PRESETS.map((preset) => (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => {
                              setBannerUrl(preset.url);
                              setBannerImgError(false);
                            }}
                            className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                              bannerUrl === preset.url
                                ? 'bg-[#F47521] text-black font-bold'
                                : 'bg-[#232732] text-neutral-300 hover:bg-[#2E3342]'
                            }`}
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BASIC INFORMATION */}
          {editorSection === 'info' && (
            <div className="space-y-4 bg-[#191B22] p-4 rounded-xl border border-[#232732]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-200 mb-1">
                    Anime Nomi (O'zbekcha / Asosiy)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0F1014] border border-[#2A2E3D] focus:border-[#F47521] text-white px-3 py-2 rounded-lg text-xs outline-none"
                    placeholder="Masalan: Solo Leveling"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-200 mb-1">
                    Asl Nomi (Yaponcha / Original)
                  </label>
                  <input
                    type="text"
                    value={originalTitle}
                    onChange={(e) => setOriginalTitle(e.target.value)}
                    className="w-full bg-[#0F1014] border border-[#2A2E3D] focus:border-[#F47521] text-white px-3 py-2 rounded-lg text-xs outline-none"
                    placeholder="Masalan: 俺だけレベルアップな件"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1">
                  Syujet Tavsifi (O'zbekcha)
                </label>
                <textarea
                  rows={3}
                  value={synopsisUz}
                  onChange={(e) => setSynopsisUz(e.target.value)}
                  className="w-full bg-[#0F1014] border border-[#2A2E3D] focus:border-[#F47521] text-white px-3 py-2 rounded-lg text-xs outline-none resize-none"
                  placeholder="Anime qisqacha mazmuni..."
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Mavsum
                  </label>
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-[#0F1014] border border-[#2A2E3D] text-white px-2.5 py-1.5 rounded-lg text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Chiqarilgan yili
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                    className="w-full bg-[#0F1014] border border-[#2A2E3D] text-white px-2.5 py-1.5 rounded-lg text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Asosiy Rang
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-neutral-400">{accentColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Ovoz / Tarjima
                  </label>
                  <div className="space-y-1 text-[11px] text-neutral-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasUzbekDub}
                        onChange={(e) => setHasUzbekDub(e.target.checked)}
                        className="accent-[#F47521]"
                      />
                      <span>O'zbekcha Dublyaj</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasUzbekSub}
                        onChange={(e) => setHasUzbekSub(e.target.checked)}
                        className="accent-[#F47521]"
                      />
                      <span>O'zbekcha Subtitr</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons footer */}
          <div className="pt-4 border-t border-[#232732] flex flex-wrap items-center justify-between gap-3 shrink-0">
            {defaultAnime && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 bg-[#1E232F] hover:bg-[#272D3D] text-neutral-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Asl holatiga qaytarish</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#1E232F] hover:bg-[#272D3D] text-neutral-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-[#F47521] hover:bg-[#FF8533] disabled:opacity-50 text-black rounded-lg text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-[#F47521]/20 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>O'zgarishlarni saqlash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
