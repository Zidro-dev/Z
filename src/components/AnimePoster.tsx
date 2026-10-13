import React, { useState } from 'react';
import { Film, Star, Play } from 'lucide-react';

interface AnimePosterProps {
  src?: string;
  alt: string;
  title: string;
  originalTitle?: string;
  rating?: number;
  accentColor?: string;
  className?: string;
  showPlayOnHover?: boolean;
}

export const AnimePoster: React.FC<AnimePosterProps> = ({
  src,
  alt,
  title,
  originalTitle,
  rating,
  accentColor = '#F47521',
  className = '',
  showPlayOnHover = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#141519] flex items-center justify-center select-none ${className}`}
      style={{
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
      }}
    >
      {!hasError && src ? (
        <>
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <Film className="w-8 h-8 text-neutral-700" />
            </div>
          )}
        </>
      ) : (
        /* Resilient Zero-Broken-Image Fallback Canvas */
        <div
          className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-br from-[#1C1F26] via-[#12141A] to-[#0A0B0E]"
          style={{
            borderTop: `2px solid ${accentColor}`,
          }}
        >
          {/* Kanji / Japanese Ambient watermark */}
          <div className="absolute right-2 top-4 text-neutral-800/40 text-4xl font-extrabold select-none pointer-events-none tracking-widest writing-vertical">
            {originalTitle ? originalTitle.slice(0, 4) : 'アニメ'}
          </div>

          <div className="flex items-center justify-between z-10">
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              HD Anime
            </span>
            {rating && (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <div className="z-10 mt-auto">
            <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
              {title}
            </h4>
            {originalTitle && (
              <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 font-light">
                {originalTitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Subtle Dark Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Play Icon Overlay on Hover */}
      {showPlayOnHover && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-[#F47521] flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white translate-x-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};
