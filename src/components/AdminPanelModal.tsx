import React, { useState } from 'react';
import {
  X,
  Shield,
  Crown,
  Plus,
  Users,
  Ban,
  CheckCircle,
  AlertTriangle,
  Film,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  UserX,
  Play,
  Sliders,
  Search,
  Edit3,
} from 'lucide-react';
import { useAuth, OWNER_EMAIL } from '../context/AuthContext';
import { Anime, Episode } from '../types/anime';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  animes: Anime[];
  onEpisodeAdded: (animeId: string, newEpisode: Episode) => void;
  onEditAnime: (anime: Anime) => void;
  onOpenAddAnime?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  animes,
  onEpisodeAdded,
  onEditAnime,
  onOpenAddAnime,
}) => {
  const {
    profile,
    isOwner,
    isAdmin,
    allUsers,
    promoteToAdmin,
    demoteAdmin,
    banUser,
    unbanUser,
    addNewEpisode,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'episodes' | 'animes' | 'bans' | 'admins'>('episodes');
  const [animeSearchQuery, setAnimeSearchQuery] = useState('');

  // New episode form state
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>(animes[0]?.id || 'one-piece');
  const [epNumber, setEpNumber] = useState<number>(13);
  const [epTitle, setEpTitle] = useState('');
  const [epTitleUz, setEpTitleUz] = useState('');
  const [epDuration, setEpDuration] = useState('24:00');
  const [epVideoUrl, setEpVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [epThumbnail, setEpThumbnail] = useState('');
  const [epDescription, setEpDescription] = useState('');

  // Ban dialog state
  const [banTargetUserId, setBanTargetUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [isPermanentBan, setIsPermanentBan] = useState(false);

  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Selected anime for context
  const targetAnime = animes.find((a) => a.id === selectedAnimeId) || animes[0];

  const adminBanUsed = profile?.adminBanCount || 0;
  const adminBansRemaining = Math.max(0, 3 - adminBanUsed);

  const handleCreateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsLoading(true);

    try {
      if (!epTitleUz.trim()) {
        throw new Error("Iltimos, qismning o'zbekcha nomini kiriting.");
      }

      const newEp: Episode = {
        id: `${selectedAnimeId}-ep-${epNumber}`,
        episodeNumber: Number(epNumber),
        title: epTitle.trim() || epTitleUz.trim(),
        titleUz: epTitleUz.trim(),
        duration: epDuration.trim() || '24:00',
        durationSec: 1440,
        thumbnail: epThumbnail.trim() || targetAnime.posterUrl,
        description: epDescription.trim() || "Yangi rasmiy premyera qismi.",
        videoUrl: epVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        releaseDate: new Date().toISOString().split('T')[0],
        introStartSec: 85,
        introEndSec: 175,
      };

      await addNewEpisode(newEp);
      onEpisodeAdded(selectedAnimeId, newEp);

      setStatusMsg({ text: `"${targetAnime.title}" ga ${newEp.episodeNumber}-qism muvaffaqiyatli qo'shildi!` });
      setEpTitle('');
      setEpTitleUz('');
      setEpDescription('');
      setEpNumber((prev) => prev + 1);
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Xatolik yuz berdi", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteBan = async () => {
    if (!banTargetUserId) return;
    setStatusMsg(null);
    setIsLoading(true);

    try {
      await banUser(banTargetUserId, banReason, isPermanentBan);
      setStatusMsg({ text: "Foydalanuvchi muvaffaqiyatli bloklandi!" });
      setBanTargetUserId(null);
      setBanReason('');
      setIsPermanentBan(false);
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Bloklashda xatolik yuz berdi", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteUnban = async (userId: string) => {
    setStatusMsg(null);
    setIsLoading(true);
    try {
      await unbanUser(userId);
      setStatusMsg({ text: "Foydalanuvchi blokdan chiqarildi!" });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Blokdan chiqarishda xatolik", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteAdmin = async (userId: string) => {
    setStatusMsg(null);
    setIsLoading(true);
    try {
      await promoteToAdmin(userId);
      setStatusMsg({ text: "Foydalanuvchiga Adminlik vakolati berildi!" });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Admin qilishda xatolik", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoteAdmin = async (userId: string) => {
    setStatusMsg(null);
    setIsLoading(true);
    try {
      await demoteAdmin(userId);
      setStatusMsg({ text: "Adminlik vakolati bekor qilindi." });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Vakolatni bekor qilishda xatolik", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header with Role Badge */}
        <div className="p-5 border-b border-[#232732] flex items-center justify-between bg-[#191B22]/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isOwner
                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40 shadow-lg shadow-amber-400/10'
                : 'bg-[#F47521]/20 text-[#F47521] border border-[#F47521]/40'
            }`}>
              {isOwner ? <Crown className="w-5 h-5 fill-amber-400" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  AniRoll Boshqaruv Markazi
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isOwner
                    ? 'bg-amber-400 text-black font-black uppercase'
                    : 'bg-[#F47521] text-black font-extrabold'
                }`}>
                  {isOwner ? '👑 Asosiy Egasi (Owner)' : '🛡️ Admin'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                {isOwner ? `${OWNER_EMAIL} (Barcha huquqlar ochiq)` : `Admin: ${profile?.displayName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isOwner && (
              <div className="px-3 py-1 rounded-lg bg-[#0B0C0E] border border-[#232732] text-xs">
                <span className="text-neutral-400">Ban kvotangiz: </span>
                <span className={`font-mono font-bold ${adminBansRemaining > 0 ? 'text-[#F47521]' : 'text-red-400'}`}>
                  {adminBansRemaining} / 3 ta qoldi
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Yopish"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1E232F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMsg && (
          <div className={`p-3 text-xs flex items-center gap-2 font-medium ${
            statusMsg.isError
              ? 'bg-red-950/60 text-red-300 border-b border-red-900/60'
              : 'bg-emerald-950/60 text-emerald-300 border-b border-emerald-900/60'
          }`}>
            {statusMsg.isError ? <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" /> : <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tab Controls (Buttons with click handlers per 1.A) */}
        <div className="flex items-center gap-2 p-3 bg-[#161820] border-b border-[#232732] text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'episodes'
                ? 'bg-[#F47521] text-black font-extrabold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#1E232F]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Qism Qo'shish</span>
          </button>

          <button
            onClick={() => setActiveTab('animes')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'animes'
                ? 'bg-[#F47521] text-black font-extrabold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#1E232F]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Animelarni Tahrirlash ({animes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bans')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'bans'
                ? 'bg-[#F47521] text-black font-extrabold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#1E232F]'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>Foydalanuvchilarni Bloklash (Ban)</span>
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'admins'
                  ? 'bg-amber-400 text-black font-black shadow-md'
                  : 'text-amber-400/80 hover:text-amber-400 hover:bg-amber-400/10'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Adminlarni Boshqarish (Owner)</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: ADD NEW EPISODE */}
          {activeTab === 'episodes' && (
            <form onSubmit={handleCreateEpisode} className="space-y-4">
              <div className="bg-[#191B22] p-4 rounded-xl border border-[#232732] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#232732]">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#F47521]" />
                      <span>Premyera Qismini Nashr Qilish</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Yangi yuklangan qism foydalanuvchilar pleyerida darhol paydo bo'ladi.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Anime */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Anime Serialini Tanlang
                    </label>
                    <select
                      value={selectedAnimeId}
                      onChange={(e) => {
                        setSelectedAnimeId(e.target.value);
                        const a = animes.find((x) => x.id === e.target.value);
                        if (a) {
                          setEpNumber(a.episodes.length + 1);
                        }
                      }}
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#F47521] cursor-pointer"
                    >
                      {animes.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title} ({a.episodes.length} ta mavjud qism)
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#232732]">
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Jami: {targetAnime.totalEpisodes} qism ({targetAnime.status})
                      </span>
                      <button
                        type="button"
                        onClick={() => onEditAnime(targetAnime)}
                        className="text-[11px] text-[#F47521] hover:text-[#FF8533] font-bold flex items-center gap-1 cursor-pointer bg-[#F47521]/10 px-2 py-1 rounded-md border border-[#F47521]/30 transition-colors"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Qismlar soni va rasmni sozlash</span>
                      </button>
                    </div>
                  </div>

                  {/* Episode Number */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Qism Raqami (Episode #)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={epNumber}
                      onChange={(e) => setEpNumber(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#F47521]"
                    />
                  </div>

                  {/* Title Uzbek */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Qism Nomi (O'zbek Tilida) *
                    </label>
                    <input
                      type="text"
                      required
                      value={epTitleUz}
                      onChange={(e) => setEpTitleUz(e.target.value)}
                      placeholder="Masalan: Soyalar Qiroli Qaytdi"
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
                    />
                  </div>

                  {/* Title Original / English */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Asl nomi (Inglizcha / Yaponcha)
                    </label>
                    <input
                      type="text"
                      value={epTitle}
                      onChange={(e) => setEpTitle(e.target.value)}
                      placeholder="Masalan: The Monarch's Domain"
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
                    />
                  </div>

                  {/* Video URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Video Manzili (MP4 / Stream URL) *
                    </label>
                    <input
                      type="url"
                      required
                      value={epVideoUrl}
                      onChange={(e) => setEpVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 font-mono focus:outline-hidden focus:border-[#F47521]"
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Miniatyura Rasmi (Thumbnail URL)
                    </label>
                    <input
                      type="url"
                      value={epThumbnail}
                      onChange={(e) => setEpThumbnail(e.target.value)}
                      placeholder="Bo'sh qoldirilsa anime posteri ishlatiladi"
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 font-mono focus:outline-hidden focus:border-[#F47521]"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Davomiyligi (Vaqt)
                    </label>
                    <input
                      type="text"
                      value={epDuration}
                      onChange={(e) => setEpDuration(e.target.value)}
                      placeholder="24:00"
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-[#F47521]"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Qismning Syujet Tavsifi
                    </label>
                    <textarea
                      rows={2}
                      value={epDescription}
                      onChange={(e) => setEpDescription(e.target.value)}
                      placeholder="Ushbu qismda sodir bo'ladigan voqealar haqida qisqacha..."
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#F47521] hover:bg-[#FF8533] disabled:opacity-50 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#F47521]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Qismni Saytga Joylash</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB: ANIME MANAGEMENT & EDITING */}
          {activeTab === 'animes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#232732]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#F47521]" />
                    <span>Barcha Animelarni Tahrirlash va Sozlash</span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Har bir animening jami qismlar sonini belgilash, poster va banner rasmlarini o'zgartirish.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onOpenAddAnime && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAddAnime();
                      }}
                      className="px-3 py-1.5 bg-[#F47521] hover:bg-[#FF8533] text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Anime Qo'shish</span>
                    </button>
                  )}

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={animeSearchQuery}
                      onChange={(e) => setAnimeSearchQuery(e.target.value)}
                      placeholder="Anime qidirish..."
                      className="w-full bg-[#12141A] border border-[#232732] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F47521]"
                    />
                  </div>
                </div>
              </div>

              {/* Anime List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {animes
                  .filter((a) =>
                    a.title.toLowerCase().includes(animeSearchQuery.toLowerCase()) ||
                    a.originalTitle.toLowerCase().includes(animeSearchQuery.toLowerCase()) ||
                    a.genres.some((g) => g.toLowerCase().includes(animeSearchQuery.toLowerCase()))
                  )
                  .map((anime) => (
                    <div
                      key={anime.id}
                      className="bg-[#191B22] border border-[#232732] hover:border-[#F47521]/50 rounded-xl p-3 flex gap-3 transition-all group"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 aspect-[3/4] rounded-lg overflow-hidden bg-black shrink-0 relative border border-[#2A2E3D]">
                        <img
                          src={anime.posterUrl}
                          alt={anime.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Edit Action */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-white group-hover:text-[#F47521] transition-colors line-clamp-1">
                              {anime.title}
                            </h4>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                              anime.status === 'Davom etmoqda'
                                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}>
                              {anime.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 line-clamp-1">
                            {anime.season} · {anime.year} · {anime.genres.slice(0, 2).join(', ')}
                          </p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#232732]/70 flex items-center justify-between">
                          <div className="text-[11px] font-mono text-neutral-300">
                            <span className="text-[#F47521] font-bold">Jami: {anime.totalEpisodes}</span> qism
                            <span className="text-neutral-500 text-[10px] ml-1">({anime.episodes.length} ta ochiq)</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onEditAnime(anime)}
                            className="px-2.5 py-1 bg-[#F47521] hover:bg-[#FF8533] text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 stroke-[2.5]" />
                            <span>Tahrirlash</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: USER BAN SYSTEM */}
          {activeTab === 'bans' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#232732]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserX className="w-4 h-4 text-red-400" />
                    <span>Foydalanuvchilarni Bloklash va Nazorat Qilish</span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {isOwner
                      ? "Owner sifatida siz istalgan foydalanuvchini saytdan butunlay chetlatishingiz (permanent ban) mumkin."
                      : `Admin sifatida siz 3 ta foydalanuvchigacha ban bera olasiz (Qolgan: ${adminBansRemaining} ta).`}
                  </p>
                </div>
              </div>

              {/* Ban action modal / dialog */}
              {banTargetUserId && (
                <div className="p-4 bg-red-950/30 border border-red-800/60 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Foydalanuvchini bloklash oynasi:</span>
                  </h4>

                  <div>
                    <label className="block text-[11px] text-neutral-300 mb-1">
                      Bloklash Sababi (Reason):
                    </label>
                    <input
                      type="text"
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Masalan: Spoyler yozgan, izohlarda haqorat qilgan..."
                      className="w-full bg-[#12141A] border border-red-900/50 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-500"
                    />
                  </div>

                  {isOwner && (
                    <div className="pt-2 pb-1 space-y-2 border-t border-red-900/40">
                      <p className="text-[11px] font-bold text-amber-300">
                        👑 Owner vakolati — Bloklash turi:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label className={`p-2.5 rounded-lg border cursor-pointer flex items-start gap-2 transition-colors ${
                          !isPermanentBan
                            ? 'bg-red-950/40 border-red-700 text-white'
                            : 'bg-[#12141A] border-[#232732] text-neutral-400'
                        }`}>
                          <input
                            type="radio"
                            name="banType"
                            checked={!isPermanentBan}
                            onChange={() => setIsPermanentBan(false)}
                            className="mt-0.5 text-red-600 focus:ring-0"
                          />
                          <div>
                            <span className="font-bold block text-neutral-200">Oddiy cheklov (Izoh / reyting taqiqlash)</span>
                            <span className="text-[10px] text-neutral-400">Foydalanuvchi anime ko'ra oladi, lekin izoh yoza olmaydi</span>
                          </div>
                        </label>

                        <label className={`p-2.5 rounded-lg border cursor-pointer flex items-start gap-2 transition-colors ${
                          isPermanentBan
                            ? 'bg-red-900/50 border-red-500 text-white shadow-md'
                            : 'bg-[#12141A] border-[#232732] text-neutral-400'
                        }`}>
                          <input
                            type="radio"
                            name="banType"
                            checked={isPermanentBan}
                            onChange={() => setIsPermanentBan(true)}
                            className="mt-0.5 text-red-600 focus:ring-0"
                          />
                          <div>
                            <span className="font-bold block text-red-300">Umuman saytga kira olmaydigan qilish (To'liq Blacklist)</span>
                            <span className="text-[10px] text-red-400">Foydalanuvchi saytga kishi bilan butunlay qulflanadi</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleExecuteBan}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Tasdiqlash & Bloklash
                    </button>
                    <button
                      onClick={() => setBanTargetUserId(null)}
                      className="px-4 py-2 bg-[#1E232F] hover:bg-[#2A3142] text-neutral-300 text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}

              {/* Users List Table */}
              <div className="space-y-2">
                {allUsers.map((u) => {
                  const isUserOwner = u.role === 'owner' || u.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
                  return (
                    <div
                      key={u.uid}
                      className="p-3 bg-[#191B22] border border-[#232732] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-black shrink-0 border border-neutral-700">
                          <img
                            src={u.avatar}
                            alt={u.displayName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {u.displayName}
                            </span>
                            {isUserOwner && (
                              <span className="text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded">
                                OWNER
                              </span>
                            )}
                            {u.role === 'admin' && !isUserOwner && (
                              <span className="text-[10px] font-bold bg-[#F47521] text-black px-1.5 py-0.2 rounded">
                                ADMIN
                              </span>
                            )}
                            {u.isPermanentlyBanned ? (
                              <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded">
                                BUTUNLAY BLOKLANGAN
                              </span>
                            ) : u.isBanned ? (
                              <span className="text-[10px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded">
                                BLOKLANGAN
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-emerald-600/30 text-emerald-400 px-1.5 py-0.2 rounded">
                                FAOL
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            {u.email}
                          </p>
                          {u.isBanned && u.banReason && (
                            <p className="text-[10px] text-red-400 mt-1">
                              Sabab: {u.banReason} (Kim tomonidan: {u.bannedBy})
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {isUserOwner ? (
                          <span className="text-[11px] text-neutral-500 italic">
                            Daxlsiz (Owner)
                          </span>
                        ) : u.isBanned || u.isPermanentlyBanned ? (
                          <button
                            onClick={() => handleExecuteUnban(u.uid)}
                            disabled={isLoading || (u.isPermanentlyBanned && !isOwner)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-600/40 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Blokdan chiqarish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setBanTargetUserId(u.uid);
                              setBanReason('');
                              setIsPermanentBan(false);
                            }}
                            disabled={!isOwner && adminBansRemaining <= 0}
                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/40 disabled:opacity-40 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Ban berish</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN APPOINTMENT (OWNER ONLY) */}
          {activeTab === 'admins' && isOwner && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#232732]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Adminlarni Tayinlash va Nazorat Qilish (Owner Vakolati)</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Faqat siz yangi adminlarni tanlay olasiz. Tayinlangan adminlar yangi qismlarni qo'sha oladi va 3 tagacha qoidabuzar foydalanuvchiga ban berish imkoniyatiga ega bo'ladi.
                </p>
              </div>

              <div className="space-y-2">
                {allUsers.map((u) => {
                  const isUserOwner = u.role === 'owner' || u.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
                  if (isUserOwner) return null;

                  return (
                    <div
                      key={u.uid}
                      className="p-3 bg-[#191B22] border border-[#232732] rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-black shrink-0 border border-neutral-700">
                          <img
                            src={u.avatar}
                            alt={u.displayName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {u.displayName}
                            </span>
                            {u.role === 'admin' ? (
                              <span className="text-[10px] font-black bg-[#F47521] text-black px-1.5 py-0.2 rounded">
                                ADMIN
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium bg-[#232732] text-neutral-400 px-1.5 py-0.2 rounded">
                                ODDIY FOYDALANUVCHI
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div>
                        {u.role === 'admin' ? (
                          <button
                            onClick={() => handleDemoteAdmin(u.uid)}
                            disabled={isLoading}
                            className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Adminlikni bekor qilish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePromoteAdmin(u.uid)}
                            disabled={isLoading}
                            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Admin qilib tayinlash</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
