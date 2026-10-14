import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Film,
  Image as ImageIcon,
  Check,
  CheckCircle,
  AlertTriangle,
  Layers,
  Star,
  Tv,
  Calendar,
  Building,
  Shield,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { Anime, Genre } from '../types/anime';
import { useAuth } from '../context/AuthContext';

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnime: (anime: Anime) => void;
}

const AVAILABLE_GENRES: Genre[] = [
  'Jangari',
  'Shounen',
  'Fantastika',
  'Isekai',
  'Romantika',
  'Psixologik',
  'Komediya',
  "G'ayritabiiy",
  'Drama',
  'Sci-Fi',
];

const PRESET_COVERS = [
  {
    name: 'Naruto: Shippuden',
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-jL5n158pY0mB.png',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1735-86fQe97fQ0J0.jpg',
    studio: 'Studio Pierrot',
    year: 2007,
    genres: ['Shounen', 'Jangari', 'Fantastika'] as Genre[],
    accent: '#F97316',
    episodes: 500,
  },
  {
    name: 'Bleach: Thousand-Year Blood War',
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx114446-0b8g3hHauvU8.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/114446-j534JtJ7bF8Q.jpg',
    studio: 'Studio Pierrot',
    year: 2022,
    genres: ['Jangari', 'Shounen', "G'ayritabiiy"] as Genre[],
    accent: '#3B82F6',
    episodes: 366,
  },
  {
    name: 'Attack on Titan (Shingeki no Kyojin)',
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFfNsDxEGq.jpg',
    studio: 'MAPPA / Wit Studio',
    year: 2013,
    genres: ['Jangari', 'Drama', 'Fantastika'] as Genre[],
    accent: '#DC2626',
    episodes: 89,
  },
  {
    name: 'Jujutsu Kaisen',
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-jQBSkxWAAk83.jpg',
    studio: 'MAPPA',
    year: 2020,
    genres: ['Jangari', "G'ayritabiiy", 'Shounen'] as Genre[],
    accent: '#8B5CF6',
    episodes: 47,
  },
  {
    name: 'Demon Slayer: Kimetsu no Yaiba',
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgLd.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YfZhhrXBj5Qr.jpg',
    studio: 'ufotable',
    year: 2019,
    genres: ['Jangari', 'Fantastika', 'Shounen'] as Genre[],
    accent: '#EF4444',
    episodes: 55,
  },
  {
    name: 'Solo Leveling',
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg',
    studio: 'A-1 Pictures',
    year: 2024,
    genres: ['Jangari', 'Fantastika', 'Shounen'] as Genre[],
    accent: '#3B82F6',
    episodes: 25,
  },
];

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({
  isOpen,
  onClose,
  onAddAnime,
}) => {
  const { isAdmin, isOwner, user } = useAuth();

  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [synopsisUz, setSynopsisUz] = useState('');
  const [totalEpisodes, setTotalEpisodes] = useState<number>(24);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [season, setSeason] = useState('1-Mavsum');
  const [status, setStatus] = useState<'Davom etmoqda' | 'Tugallangan'>('Davom etmoqda');
  const [studio, setStudio] = useState('Toei Animation');
  const [ageRating, setAgeRating] = useState('13+');
  const [rating, setRating] = useState<number>(9.2);
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [accentColor, setAccentColor] = useState('#F47521');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(['Shounen', 'Jangari']);
  const [hasUzbekDub, setHasUzbekDub] = useState(true);
  const [hasUzbekSub, setHasUzbekSub] = useState(true);

  // First episode details
  const [firstEpTitleUz, setFirstEpTitleUz] = useState('1-Qism boshlanishi');
  const [firstEpVideoUrl, setFirstEpVideoUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const applyPreset = (preset: (typeof PRESET_COVERS)[0]) => {
    if (!title) setTitle(preset.name);
    setPosterUrl(preset.poster);
    setBannerUrl(preset.banner);
    setStudio(preset.studio);
    setYear(preset.year);
    setAccentColor(preset.accent);
    setSelectedGenres(preset.genres);
    setTotalEpisodes(preset.episodes);
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMsg("Iltimos, anime nomini kiriting!");
      return;
    }

    if (totalEpisodes < 1) {
      setErrorMsg("Jami qismlar soni kamida 1 bo'lishi kerak.");
      return;
    }

    // Generate unique ID
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'anime';
    const uniqueId = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const effectivePoster =
      posterUrl.trim() ||
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';
    const effectiveBanner =
      bannerUrl.trim() ||
      effectivePoster;

    const newAnime: Anime = {
      id: uniqueId,
      title: title.trim(),
      originalTitle: originalTitle.trim() || title.trim(),
      synopsisUz:
        synopsisUz.trim() ||
        `${title.trim()} seriali rasmiy o'zbekcha ovoz va subtitrlarda AniRoll platformasida.`,
      synopsisEn: `${title.trim()} series available on AniRoll.`,
      genres: selectedGenres.length > 0 ? selectedGenres : ['Shounen'],
      rating: Number(rating) || 9.0,
      ratingCount: '1.2K',
      season: season.trim() || '1-Mavsum',
      year: Number(year) || 2024,
      status,
      studio: studio.trim() || 'Studio',
      ageRating,
      posterUrl: effectivePoster,
      bannerUrl: effectiveBanner,
      accentColor: accentColor || '#F47521',
      isFeatured: false,
      isTrending: true,
      isNewRelease: true,
      hasUzbekDub,
      hasUzbekSub,
      totalEpisodes: Number(totalEpisodes),
      episodes: [
        {
          id: `${uniqueId}-ep-1`,
          episodeNumber: 1,
          title: 'Episode 1',
          titleUz: firstEpTitleUz.trim() || '1-Qism',
          duration: '24:00',
          durationSec: 1440,
          thumbnail: effectivePoster,
          description: `${title.trim()} animesining dastlabki qismi.`,
          videoUrl:
            firstEpVideoUrl.trim() ||
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          releaseDate: new Date().toISOString().split('T')[0],
          introStartSec: 90,
          introEndSec: 180,
        },
      ],
    };

    onAddAnime(newAnime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#111216] border border-[#232732] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#232732] bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F47521] to-amber-500 flex items-center justify-center text-black font-black shadow-lg shadow-[#F47521]/20">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Yangi Anime Qo'shish
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F47521]/20 border border-[#F47521]/40 text-[#F47521]">
                  Admin & Owner
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Saytga yangi anime kiritish: qismlar soni, poster, tavsif va video manbalari
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#232732] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-neutral-200">
          
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-2 text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Preset Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Tezkor Tayyor Shablonlar (1-bosishda rasmlar va ma'lumotlarni to'ldirish):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#181A22] hover:bg-[#232732] border border-[#2B2F3D] text-left transition-colors cursor-pointer group"
                >
                  <img
                    src={preset.poster}
                    alt={preset.name}
                    className="w-8 h-10 object-cover rounded shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-[11px] truncate">{preset.name}</p>
                    <p className="text-[10px] text-neutral-400">{preset.episodes} qism · {preset.year}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block font-bold text-white">
                Anime Nomi <span className="text-[#F47521]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Naruto, Bleach, Attack on Titan..."
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
              />
            </div>

            {/* Original Title */}
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-300">
                Asl / Yaponcha Nomi
              </label>
              <input
                type="text"
                value={originalTitle}
                onChange={(e) => setOriginalTitle(e.target.value)}
                placeholder="Masalan: NARUTO -ナルト-, BLEACH..."
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
              />
            </div>

            {/* Total Episodes (Target of user prompt) */}
            <div className="space-y-1.5">
              <label className="block font-bold text-amber-300 flex items-center justify-between">
                <span>Jami Qismlar Soni (Total Episodes)</span>
                <span className="text-[10px] text-neutral-400 font-normal">foydalanuvchilar ko'radi</span>
              </label>
              <input
                type="number"
                min={1}
                max={5000}
                value={totalEpisodes}
                onChange={(e) => setTotalEpisodes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#161820] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-amber-300 font-mono font-bold focus:outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-300">
                Chiqarilgan Yili
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-[#F47521]"
              />
            </div>

            {/* Season */}
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-300">
                Mavsum / Fasl Nomi
              </label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="1-Mavsum, Yakuniy Fasl, Egghead..."
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-[#F47521]"
              />
            </div>

            {/* Studio */}
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-300">
                Animatsiya Studiyasi
              </label>
              <input
                type="text"
                value={studio}
                onChange={(e) => setStudio(e.target.value)}
                placeholder="Toei Animation, MAPPA, ufotable..."
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-[#F47521]"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-300">
                Holati
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-[#F47521]"
              >
                <option value="Davom etmoqda">Davom etmoqda</option>
                <option value="Tugallangan">Tugallangan</option>
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-300">
                Boshlang'ich Reyting (1.0 - 10.0)
              </label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={10}
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value) || 9.0)}
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-[#F47521]"
              />
            </div>

            {/* Age Rating */}
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-300">
                Yosh Chegarasi
              </label>
              <select
                value={ageRating}
                onChange={(e) => setAgeRating(e.target.value)}
                className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-[#F47521]"
              >
                <option value="13+">13+</option>
                <option value="16+">16+</option>
                <option value="18+">18+</option>
                <option value="Barchaga">Barchaga</option>
              </select>
            </div>

          </div>

          {/* Synopsis */}
          <div className="space-y-1.5">
            <label className="block font-medium text-neutral-300">
              O'zbekcha Tavsifi / Sinopsis
            </label>
            <textarea
              rows={3}
              value={synopsisUz}
              onChange={(e) => setSynopsisUz(e.target.value)}
              placeholder="Anime syujeti, qahramonlari va asosiy voqealar haqida qisqacha ma'lumot..."
              className="w-full bg-[#161820] border border-[#2B2F3D] rounded-xl p-3.5 text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521] resize-none"
            />
          </div>

          {/* Genres Chips */}
          <div className="space-y-2">
            <label className="block font-medium text-neutral-300">
              Janrlar (bir yoki bir nechtasini tanlang):
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_GENRES.map((g) => {
                const selected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selected
                        ? 'bg-[#F47521] text-black font-bold'
                        : 'bg-[#181A22] border border-[#2B2F3D] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image URLs & Live Preview (User prompt: Anime rasmini sozlash) */}
          <div className="p-4 bg-[#161820] border border-[#2B2F3D] rounded-2xl space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm">
              <ImageIcon className="w-4 h-4 text-[#F47521]" />
              Anime Rasmlari (Poster va Banner URL)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-neutral-400 text-[11px]">
                  Poster Rasm URL (Tik shakl)
                </label>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://.../poster.jpg"
                  className="w-full bg-[#111216] border border-[#2B2F3D] rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#F47521]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 text-[11px]">
                  Banner Rasm URL (Keng shakl)
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://.../banner.jpg"
                  className="w-full bg-[#111216] border border-[#2B2F3D] rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#F47521]"
                />
              </div>
            </div>

            {/* Live image preview card */}
            <div className="flex items-center gap-4 pt-2 border-t border-[#232732]">
              <div className="w-16 h-22 bg-[#0B0C0E] border border-[#2B2F3D] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt="Poster preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-neutral-600" />
                )}
              </div>
              <div className="text-[11px] text-neutral-400 space-y-1">
                <p className="font-bold text-white">Rasm Ko'rinishi</p>
                <p>
                  Tugma orqali yuqoridagi tayyor shablonlardan birini tanlashingiz yoki to'g'ridan-to'g'ri internetdagi rasm havolasini kiritishingiz mumkin.
                </p>
              </div>
            </div>
          </div>

          {/* Dubbing & Subtitle Toggles */}
          <div className="flex flex-wrap items-center gap-6 p-3.5 bg-[#161820] border border-[#2B2F3D] rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasUzbekDub}
                onChange={(e) => setHasUzbekDub(e.target.checked)}
                className="w-4 h-4 rounded accent-[#F47521]"
              />
              <span className="font-bold text-white">O'zbekcha Dublyaj mavjud</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasUzbekSub}
                onChange={(e) => setHasUzbekSub(e.target.checked)}
                className="w-4 h-4 rounded accent-[#F47521]"
              />
              <span className="font-bold text-white">O'zbekcha Subtitr mavjud</span>
            </label>
          </div>

          {/* First Episode Initial Video Source */}
          <div className="p-3.5 bg-[#161820] border border-[#2B2F3D] rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Tv className="w-4 h-4 text-[#F47521]" />
              <span>1-Qism Boshlang'ich Ma'lumoti (Avtomatik yaratiladi)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={firstEpTitleUz}
                onChange={(e) => setFirstEpTitleUz(e.target.value)}
                placeholder="1-qism nomi (O'zbekcha)"
                className="bg-[#111216] border border-[#2B2F3D] rounded-lg px-3 py-2 text-white text-xs placeholder-neutral-600"
              />
              <input
                type="url"
                value={firstEpVideoUrl}
                onChange={(e) => setFirstEpVideoUrl(e.target.value)}
                placeholder="Video URL (.mp4 / stream)"
                className="bg-[#111216] border border-[#2B2F3D] rounded-lg px-3 py-2 text-white text-xs placeholder-neutral-600 font-mono text-[11px]"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-[#232732] bg-[#161820]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#2B2F3D] bg-[#111216] text-neutral-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F47521] to-amber-500 text-black text-xs font-black shadow-lg shadow-[#F47521]/20 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Animeni Saytga Qo'shish</span>
          </button>
        </div>

      </div>
    </div>
  );
};
