export type Genre =
  | 'Jangari'
  | 'Shounen'
  | 'Fantastika'
  | 'Isekai'
  | 'Romantika'
  | 'Psixologik'
  | 'Komediya'
  | "G'ayritabiiy"
  | 'Drama'
  | 'Sci-Fi';

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  titleUz: string;
  duration: string;
  durationSec: number;
  thumbnail: string;
  description: string;
  videoUrl: string;
  releaseDate: string;
  introStartSec: number;
  introEndSec: number;
}

export interface Anime {
  id: string;
  title: string;
  originalTitle: string;
  synopsisUz: string;
  synopsisEn: string;
  genres: Genre[];
  rating: number; // e.g. 9.2
  ratingCount: string; // e.g. "145.2K"
  season: string;
  year: number;
  status: 'Davom etmoqda' | 'Tugallangan';
  studio: string;
  ageRating: string;
  posterUrl: string;
  bannerUrl: string;
  accentColor: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  hasUzbekDub: boolean;
  hasUzbekSub: boolean;
  dubActorsUz?: string[];
  totalEpisodes: number;
  episodes: Episode[];
}

export interface UserComment {
  id: string;
  animeId: string;
  episodeNumber: number;
  userName: string;
  userAvatar: string;
  isMegaFan?: boolean;
  text: string;
  rating: number;
  likes: number;
  userLiked?: boolean;
  createdAt: string;
  isSpoiler?: boolean;
}

export interface WatchHistoryItem {
  animeId: string;
  episodeNumber: number;
  progressSec: number;
  durationSec: number;
  lastWatchedAt: number;
}

export type AudioTrack = 'uz-dub' | 'ja-orig' | 'ru-dub';
export type SubtitleTrack = 'none' | 'uz' | 'ru' | 'en';
export type VideoQuality = '1080p' | '720p' | '480p' | 'auto';
