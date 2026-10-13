import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipForward,
  FastForward,
  Headphones,
  Subtitles,
  X,
  ListVideo,
  Star,
  Send,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import { Anime, Episode, AudioTrack, SubtitleTrack, VideoQuality, UserComment } from '../types/anime';

interface VideoPlayerModalProps {
  anime: Anime;
  initialEpisodeNumber?: number;
  onClose: () => void;
  onSaveProgress: (animeId: string, episodeNumber: number, progressSec: number, durationSec: number) => void;
  initialProgressSec?: number;
  comments: UserComment[];
  onAddComment: (comment: Omit<UserComment, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeComment: (commentId: string) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  anime,
  initialEpisodeNumber = 1,
  onClose,
  onSaveProgress,
  initialProgressSec = 0,
  comments,
  onAddComment,
  onLikeComment,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const currentEp =
    anime.episodes.find((ep) => ep.episodeNumber === initialEpisodeNumber) ||
    anime.episodes[0];

  const [activeEpisode, setActiveEpisode] = useState<Episode>(currentEp);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(initialProgressSec);
  const [duration, setDuration] = useState(currentEp?.durationSec || 1440);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioTrack, setAudioTrack] = useState<AudioTrack>(anime.hasUzbekDub ? 'uz-dub' : 'ja-orig');
  const [subtitleTrack, setSubtitleTrack] = useState<SubtitleTrack>('uz');
  const [quality, setQuality] = useState<VideoQuality>('1080p');
  const [showSettings, setShowSettings] = useState(false);
  const [showEpisodesDrawer, setShowEpisodesDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Comment submission state
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [newCommentSpoiler, setNewCommentSpoiler] = useState(false);
  const [showSpoilers, setShowSpoilers] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard controls (Space to play/pause, Arrow keys to seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        seekBy(10);
      } else if (e.code === 'ArrowLeft') {
        seekBy(-10);
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'Escape') {
        if (!isFullscreen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen]);

  // Handle controls visibility timer on mouse move
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
        setShowSettings(false);
      }
    }, 3500);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const seekBy = (seconds: number) => {
    if (videoRef.current) {
      const nextTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    } else {
      setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + seconds)));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = parseFloat(e.target.value);
    setCurrentTime(nextTime);
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const handleSkipIntro = () => {
    if (activeEpisode.introEndSec) {
      if (videoRef.current) {
        videoRef.current.currentTime = activeEpisode.introEndSec;
        setCurrentTime(activeEpisode.introEndSec);
      } else {
        setCurrentTime(activeEpisode.introEndSec);
      }
    } else {
      seekBy(85);
    }
  };

  const handleEpisodeSelect = (ep: Episode) => {
    // Save current progress first
    onSaveProgress(anime.id, activeEpisode.episodeNumber, currentTime, duration);
    setActiveEpisode(ep);
    setCurrentTime(0);
    setVideoError(false);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setShowEpisodesDrawer(false);
  };

  const handleNextEpisode = () => {
    const nextEpIndex = anime.episodes.findIndex((e) => e.id === activeEpisode.id) + 1;
    if (nextEpIndex < anime.episodes.length) {
      handleEpisodeSelect(anime.episodes[nextEpIndex]);
    }
  };

  // Video time update handler
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      if (Math.floor(cur) % 5 === 0) {
        onSaveProgress(anime.id, activeEpisode.episodeNumber, cur, duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || activeEpisode.durationSec);
      if (initialProgressSec > 0) {
        videoRef.current.currentTime = initialProgressSec;
      }
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // Submit comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment({
      animeId: anime.id,
      episodeNumber: activeEpisode.episodeNumber,
      userName: "Siz (Foydalanuvchi)",
      userAvatar: 'SZ',
      text: newCommentText.trim(),
      rating: newCommentRating,
      isMegaFan: true,
      isSpoiler: newCommentSpoiler,
    });
    setNewCommentText('');
  };

  const filteredComments = comments.filter(
    (c) => c.animeId === anime.id && c.episodeNumber === activeEpisode.episodeNumber
  );

  const isIntroTime =
    currentTime >= (activeEpisode.introStartSec || 70) &&
    currentTime <= (activeEpisode.introEndSec || 170);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0E] overflow-y-auto flex flex-col">
      {/* Top Bar inside Player View */}
      <div className="h-14 bg-[#141519] border-b border-[#232732] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1E232F] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            <span>Yopish</span>
          </button>
          <div className="h-4 w-px bg-[#232732]" />
          <div>
            <h2 className="text-sm font-bold text-white line-clamp-1">
              {anime.title} — <span className="text-[#F47521]">{activeEpisode.episodeNumber}-qism</span>: {activeEpisode.titleUz}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEpisodesDrawer(!showEpisodesDrawer)}
            className="px-3 py-1.5 rounded-lg bg-[#1E232F] hover:bg-[#2A3142] text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ListVideo className="w-4 h-4 text-[#F47521]" />
            <span>Qismlar ro'yxati ({anime.episodes.length})</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Video Viewport & Info & Comments */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Cinema Screen Frame */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[#232732] group"
          >
            {/* HTML5 Video Source */}
            {!videoError ? (
              <video
                ref={videoRef}
                src={activeEpisode.videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => setVideoError(true)}
                className="w-full h-full object-contain"
                playsInline
                autoPlay
              />
            ) : (
              /* Canvas Anime Simulation Fallback */
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#101217] via-[#161821] to-[#0A0B0E]">
                <div className="w-16 h-16 rounded-full bg-[#F47521]/20 border border-[#F47521] flex items-center justify-center text-[#F47521] mb-4">
                  <Play className="w-8 h-8 fill-[#F47521] translate-x-0.5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {anime.title} — {activeEpisode.episodeNumber}-qism
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mb-4">
                  AniRoll Ultra Stream pleyeri ishga tushirildi. Ovoz yo'li: {audioTrack === 'uz-dub' ? "O'zbekcha Dublyaj" : 'Asl ovoz'}.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVideoError(false)}
                    className="px-4 py-2 bg-[#F47521] text-black text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Qayta yuklash
                  </button>
                </div>
              </div>
            )}

            {/* "Skip Intro" Button (Crunchyroll signature) */}
            {isIntroTime && (
              <button
                onClick={handleSkipIntro}
                className="absolute right-6 bottom-20 z-30 px-4 py-2 bg-black/85 hover:bg-black text-[#F47521] border border-[#F47521]/50 rounded-lg text-xs font-black flex items-center gap-2 backdrop-blur-md shadow-xl transition-all transform hover:scale-105 cursor-pointer"
              >
                <FastForward className="w-4 h-4" />
                <span>Kirish qismini o'tkazish (Skip Intro)</span>
              </button>
            )}

            {/* Center Big Play/Pause indicator on click */}
            <div
              onClick={togglePlay}
              className="absolute inset-0 cursor-pointer flex items-center justify-center"
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-black/60 border border-[#F47521]/60 flex items-center justify-center text-white backdrop-blur-xs transform scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-[#F47521] text-[#F47521] translate-x-0.5" />
                </div>
              )}
            </div>

            {/* Video Controls Overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 z-20 ${
                controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Scrub Bar */}
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.5"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video vaqtini o'zgartirish"
                  className="w-full h-1.5 bg-neutral-700 accent-[#F47521] rounded-lg cursor-pointer hover:h-2 transition-all"
                />
              </div>

              {/* Bottom Control Buttons */}
              <div className="flex items-center justify-between text-white text-xs">
                
                {/* Left controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? "To'xtatish" : "Ijro etish"}
                    className="p-1.5 hover:text-[#F47521] transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  <button
                    onClick={() => seekBy(-10)}
                    aria-label="10 soniya orqaga"
                    className="p-1.5 hover:text-[#F47521] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => seekBy(10)}
                    aria-label="10 soniya oldinga"
                    className="p-1.5 hover:text-[#F47521] transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextEpisode}
                    aria-label="Keyingi qism"
                    className="p-1.5 hover:text-[#F47521] transition-colors cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-1.5 group/vol ml-1">
                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
                      className="p-1.5 hover:text-[#F47521] transition-colors cursor-pointer"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      aria-label="Ovoz balandligi"
                      className="w-16 h-1 bg-neutral-700 accent-[#F47521] rounded-lg cursor-pointer hidden group-hover/vol:block"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="font-mono text-[11px] text-neutral-300 ml-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                  {/* Quick Audio dub badge button */}
                  <button
                    onClick={() => setAudioTrack(audioTrack === 'uz-dub' ? 'ja-orig' : 'uz-dub')}
                    className="px-2 py-1 rounded bg-black/60 hover:bg-[#F47521]/20 text-[11px] font-bold text-[#F47521] border border-[#F47521]/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Headphones className="w-3 h-3" />
                    <span>{audioTrack === 'uz-dub' ? "O'zbekcha Ovoz" : 'Yaponcha'}</span>
                  </button>

                  {/* Settings Menu Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      aria-label="Sozlamalar"
                      className="p-1.5 hover:text-[#F47521] transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Settings Dropdown Popover */}
                    {showSettings && (
                      <div className="absolute right-0 bottom-8 w-56 bg-[#141519] border border-[#232732] rounded-xl p-3 shadow-2xl space-y-3 z-40 text-xs">
                        <div>
                          <p className="text-neutral-400 font-semibold mb-1">Tezlik</p>
                          <div className="grid grid-cols-4 gap-1">
                            {[0.75, 1, 1.25, 1.5].map((spd) => (
                              <button
                                key={spd}
                                onClick={() => handleSpeedChange(spd)}
                                className={`py-1 rounded text-center cursor-pointer ${
                                  playbackSpeed === spd
                                    ? 'bg-[#F47521] text-black font-bold'
                                    : 'bg-[#1E232F] text-neutral-300 hover:text-white'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-neutral-400 font-semibold mb-1">Sifat (Quality)</p>
                          <div className="flex gap-1">
                            {(['1080p', '720p', '480p'] as VideoQuality[]).map((q) => (
                              <button
                                key={q}
                                onClick={() => {
                                  setQuality(q);
                                  setShowSettings(false);
                                }}
                                className={`flex-1 py-1 rounded text-center cursor-pointer ${
                                  quality === q
                                    ? 'bg-[#F47521] text-black font-bold'
                                    : 'bg-[#1E232F] text-neutral-300 hover:text-white'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-neutral-400 font-semibold mb-1">Subtitrlar</p>
                          <div className="flex gap-1">
                            {(['uz', 'ru', 'none'] as SubtitleTrack[]).map((sub) => (
                              <button
                                key={sub}
                                onClick={() => {
                                  setSubtitleTrack(sub);
                                  setShowSettings(false);
                                }}
                                className={`flex-1 py-1 rounded text-center cursor-pointer ${
                                  subtitleTrack === sub
                                    ? 'bg-[#F47521] text-black font-bold'
                                    : 'bg-[#1E232F] text-neutral-300 hover:text-white'
                                }`}
                              >
                                {sub === 'uz' ? "O'zbek" : sub === 'ru' ? 'Rus' : "Yo'q"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? "Kichik ekran" : "To'liq ekran"}
                    className="p-1.5 hover:text-[#F47521] transition-colors cursor-pointer"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Episode Info & Watchlist Action */}
          <div className="bg-[#141519] border border-[#232732] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                  <span className="text-[#F47521] font-bold">{anime.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeEpisode.episodeNumber}-qism</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeEpisode.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeEpisode.releaseDate}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeEpisode.titleUz}
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Asl nomi: {activeEpisode.title}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleWatchlist}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    isInWatchlist
                      ? 'bg-[#F47521]/10 border-[#F47521] text-[#F47521]'
                      : 'bg-[#1E232F] border-[#232732] text-white hover:border-neutral-500'
                  }`}
                >
                  {isInWatchlist ? "✓ Ro'yxatingizda saqlangan" : "+ Ro'yxatga qo'shish"}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {activeEpisode.description}
            </p>

            {anime.dubActorsUz && anime.dubActorsUz.length > 0 && (
              <div className="pt-2 border-t border-[#232732] text-xs text-neutral-400">
                <span className="font-semibold text-neutral-300">O'zbekcha dublyaj ijrochilari: </span>
                {anime.dubActorsUz.join(', ')}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-[#141519] border border-[#232732] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Izohlar va Fikrlar</span>
                  <span className="text-xs font-mono font-normal text-neutral-400">
                    ({filteredComments.length})
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Ushbu qism haqidagi fikrlaringizni boshqa muxlislar bilan bo'lishing.
                </p>
              </div>

              <button
                onClick={() => setShowSpoilers(!showSpoilers)}
                className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showSpoilers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSpoilers ? "Spoylerni yashirish" : "Spoylerni ko'rsatish"}</span>
              </button>
            </div>

            {/* Post comment form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-neutral-400">Qismga bahoingiz:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewCommentRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newCommentRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Qism haqida fikringizni yozing..."
                  className="w-full bg-[#1A1C22] border border-[#232732] rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCommentSpoiler}
                    onChange={(e) => setNewCommentSpoiler(e.target.checked)}
                    className="rounded bg-[#1A1C22] border-neutral-700 text-[#F47521] focus:ring-0"
                  />
                  <span>Spoyler bor (ogohlantirish)</span>
                </label>

                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 bg-[#F47521] disabled:opacity-40 hover:bg-[#FF8533] text-black text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yuborish</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {filteredComments.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-4">
                  Bu qismga hali birinchi izoh qoldirilmadi. Birinchi bo'ling!
                </p>
              ) : (
                filteredComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 bg-[#191B22] border border-[#232732] rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#232732] text-white flex items-center justify-center font-bold text-xs border border-neutral-700">
                          {comment.userAvatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              {comment.userName}
                            </span>
                            {comment.isMegaFan && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1 rounded flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5" />
                                Fan
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {comment.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {comment.rating}
                        </span>
                      </div>
                    </div>

                    {comment.isSpoiler && !showSpoilers ? (
                      <div className="p-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Ushbu izohda syujet spoyleri mavjud. Ko'rish uchun yuqoridagi tugmani bosing.</span>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-200 leading-relaxed">
                        {comment.text}
                      </p>
                    )}

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => onLikeComment(comment.id)}
                        className={`text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          comment.userLiked
                            ? 'text-[#F47521] font-semibold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="font-mono">{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Column / Drawer: Episodes Selection Rail */}
        <div className={`w-full lg:w-80 shrink-0 ${showEpisodesDrawer ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-20 bg-[#141519] border border-[#232732] rounded-xl p-4 space-y-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#232732]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Barcha qismlar</span>
                <span className="text-xs font-mono text-[#F47521]">
                  ({anime.episodes.length} qism)
                </span>
              </h3>
            </div>

            <div className="space-y-2">
              {anime.episodes.map((ep) => {
                const isActive = ep.id === activeEpisode.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => handleEpisodeSelect(ep)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex gap-3 ${
                      isActive
                        ? 'bg-[#1E232F] border-[#F47521] shadow-md'
                        : 'bg-[#191B22] border-[#232732] hover:border-neutral-600'
                    }`}
                  >
                    {/* Ep Thumbnail */}
                    <div className="relative w-20 aspect-video rounded overflow-hidden bg-black shrink-0">
                      <img
                        src={ep.thumbnail}
                        alt={ep.titleUz}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#F47521]/30 flex items-center justify-center">
                          <Play className="w-4 h-4 fill-white text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 font-mono text-[9px] px-1 rounded text-neutral-300">
                        {ep.duration}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-[#F47521]' : 'text-white'}`}>
                        {ep.episodeNumber}-qism: {ep.titleUz}
                      </p>
                      <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                        {ep.title}
                      </p>
                      {isActive && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#F47521]">
                          Hozir tomosha qilinmoqda
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
