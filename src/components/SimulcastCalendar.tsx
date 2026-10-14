import React, { useState } from 'react';
import { Calendar, Clock, Play, Headphones, Bell } from 'lucide-react';
import { Anime } from '../types/anime';
import { AnimePoster } from './AnimePoster';

interface SimulcastCalendarProps {
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
}

const DAYS_OF_WEEK = [
  { id: 'mon', name: 'Dushanba', short: 'Dush' },
  { id: 'tue', name: 'Seshanba', short: 'Sesh' },
  { id: 'wed', name: 'Chorshanba', short: 'Chor' },
  { id: 'thu', name: 'Payshanba', short: 'Pay' },
  { id: 'fri', name: 'Juma', short: 'Jum' },
  { id: 'sat', name: 'Shanba', short: 'Shan' },
  { id: 'sun', name: 'Yakshanba', short: 'Yak' },
];

export const SimulcastCalendar: React.FC<SimulcastCalendarProps> = ({
  animes,
  onSelectAnime,
  onPlayAnime,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('sun');

  // Dynamic distribution of available animes across week days
  const scheduleMapping = React.useMemo(() => {
    const mapping: Record<string, { anime: Anime; time: string; episodeLabel: string; isAired: boolean }[]> = {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    };

    if (animes.length === 0) return mapping;

    // One Piece traditionally airs on Sunday morning in Japan
    const onePiece = animes.find((a) => a.id === 'one-piece') || animes[0];
    if (onePiece) {
      mapping.sun.push({
        anime: onePiece,
        time: '09:30',
        episodeLabel: `${onePiece.episodes[onePiece.episodes.length - 1]?.episodeNumber || 1094}-qism (Premyera)`,
        isAired: true,
      });
      mapping.sat.push({
        anime: onePiece,
        time: '20:00',
        episodeLabel: "O'tgan qism sharhi",
        isAired: true,
      });
    }

    // Distribute any additional animes added by admin
    const days: (keyof typeof mapping)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    animes.forEach((anime, idx) => {
      if (anime.id === 'one-piece') return;
      const targetDay = days[idx % days.length];
      mapping[targetDay].push({
        anime,
        time: `${18 + (idx % 4)}:30`,
        episodeLabel: `${anime.episodes.length || 1}-qism`,
        isAired: idx % 2 === 0,
      });
    });

    return mapping;
  }, [animes]);

  const currentSchedule = (scheduleMapping[selectedDay] || []).filter(item => Boolean(item.anime));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-[#232732]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Calendar className="w-7 h-7 text-[#F47521]" />
          <span>Yangi Qismlar & Haftalik Taqvimi</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Simulcast translyatsiya jadvali: yangi qismlar Yaponiyadan so'ng rasmiy o'zbekcha dublyaj bilan qachon chiqishi haqida aniq ma'lumot.
        </p>
      </div>

      {/* Days Tabs (Buttons with click handlers per 1.A) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDay === day.id
                ? 'bg-[#F47521] text-black shadow-md shadow-[#F47521]/20'
                : 'bg-[#141519] border border-[#232732] text-neutral-400 hover:text-white hover:border-neutral-600'
            }`}
          >
            {day.name}
          </button>
        ))}
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4 pt-2">
        {currentSchedule.length === 0 ? (
          <div className="text-center py-12 bg-[#141519] border border-[#232732] rounded-xl text-neutral-400 text-xs">
            Ushbu kunga rejalashtirilgan yangi premyera yo'q.
          </div>
        ) : (
          currentSchedule.map((item, idx) => (
            <div
              key={`${item.anime.id}-${idx}`}
              className="p-4 bg-[#141519] border border-[#232732] hover:border-[#F47521]/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group"
            >
              <div
                onClick={() => onSelectAnime(item.anime)}
                className="flex items-center gap-4 cursor-pointer min-w-0 flex-1"
              >
                {/* Time Badge */}
                <div className="flex flex-col items-center justify-center p-2.5 bg-[#191B22] border border-[#232732] rounded-lg shrink-0 w-16 text-center">
                  <Clock className="w-3.5 h-3.5 text-[#F47521] mb-1" />
                  <span className="text-xs font-mono font-bold text-white">
                    {item.time}
                  </span>
                </div>

                {/* Poster */}
                <div className="w-14 aspect-[3/4] rounded-lg overflow-hidden shrink-0 bg-black">
                  <AnimePoster
                    src={item.anime.posterUrl}
                    alt={item.anime.title}
                    title={item.anime.title}
                    accentColor={item.anime.accentColor}
                    className="w-full h-full"
                  />
                </div>

                {/* Title and details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#F47521] line-clamp-1 transition-colors">
                      {item.anime.title}
                    </h3>
                    {item.anime.hasUzbekDub && (
                      <span className="text-[9px] font-bold text-[#F47521] bg-[#F47521]/10 px-1.5 py-0.2 rounded hidden sm:inline-flex items-center gap-0.5">
                        <Headphones className="w-2.5 h-2.5" />
                        DUB
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#F47521] font-semibold mt-0.5">
                    {item.episodeLabel}
                  </p>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                    {item.anime.studio} · {item.anime.genres.join(', ')}
                  </p>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {item.isAired ? (
                  <button
                    onClick={() => onPlayAnime(item.anime)}
                    className="px-4 py-2 bg-[#F47521] hover:bg-[#FF8533] text-black text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Ko'rish</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-[#1E232F] border border-[#232732] text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Tez kunda chiqadi</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
