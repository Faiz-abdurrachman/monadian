import React from 'react';

export type MascotMood = 'idle' | 'happy' | 'battle' | 'victory' | 'sad';

interface MonaBunnyMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
  showAura?: boolean;
}

export const MonaBunnyMascot: React.FC<MonaBunnyMascotProps> = ({
  mood = 'idle',
  size = 64,
  className = '',
  showAura = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Radial Aura */}
      {showAura && (
        <div
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-500 ${
            mood === 'victory'
              ? 'bg-amber-300/40 animate-pulse'
              : mood === 'battle'
              ? 'bg-rose-400/35 animate-pulse'
              : 'bg-pink-300/30'
          }`}
        />
      )}

      {/* SVG Canvas for Crisp, Pixel-Perfect Scalability */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative z-10 transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bunnyFur" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF0F5" />
          </linearGradient>

          <linearGradient id="earInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFB3C1" />
            <stop offset="100%" stopColor="#FF758F" />
          </linearGradient>

          <linearGradient id="monadPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#836EF9" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id="goldTrophy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2F121A" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. BUNNY EARS */}
        <g className="transition-transform duration-500 origin-bottom">
          {mood === 'sad' ? (
            /* Droopy sad ears */
            <>
              {/* Left ear droop */}
              <path
                d="M32 40 C 22 42, 10 52, 12 62 C 14 70, 26 66, 34 50 Z"
                fill="url(#bunnyFur)"
                stroke="#FFCCD5"
                strokeWidth="1.5"
                filter="url(#softShadow)"
              />
              <path
                d="M30 44 C 23 46, 14 54, 15 61 C 16 66, 24 63, 31 52 Z"
                fill="url(#earInner)"
                opacity="0.85"
              />
              {/* Right ear droop */}
              <path
                d="M68 40 C 78 42, 90 52, 88 62 C 86 70, 74 66, 66 50 Z"
                fill="url(#bunnyFur)"
                stroke="#FFCCD5"
                strokeWidth="1.5"
                filter="url(#softShadow)"
              />
              <path
                d="M70 44 C 77 46, 86 54, 85 61 C 84 66, 76 63, 69 52 Z"
                fill="url(#earInner)"
                opacity="0.85"
              />
            </>
          ) : (
            /* Upright perky ears (idle, happy, battle, victory) */
            <>
              {/* Left Ear */}
              <g className={mood === 'happy' ? 'animate-bounce-short' : ''}>
                <path
                  d="M 33 42 C 24 22, 26 4, 35 4 C 44 4, 43 22, 38 42 Z"
                  fill="url(#bunnyFur)"
                  stroke="#FFCCD5"
                  strokeWidth="1.5"
                  filter="url(#softShadow)"
                />
                <path
                  d="M 34 38 C 29 23, 30 10, 35 10 C 40 10, 40 23, 37 38 Z"
                  fill="url(#earInner)"
                  opacity="0.85"
                />
              </g>

              {/* Right Ear */}
              <g className={mood === 'happy' ? 'animate-bounce-short' : ''}>
                <path
                  d="M 67 42 C 76 22, 74 4, 65 4 C 56 4, 57 22, 62 42 Z"
                  fill="url(#bunnyFur)"
                  stroke="#FFCCD5"
                  strokeWidth="1.5"
                  filter="url(#softShadow)"
                />
                <path
                  d="M 66 38 C 71 23, 70 10, 65 10 C 60 10, 60 23, 63 38 Z"
                  fill="url(#earInner)"
                  opacity="0.85"
                />
              </g>
            </>
          )}
        </g>

        {/* 2. MAIN CHIBI HEAD */}
        <circle
          cx="50"
          cy="58"
          r="30"
          fill="url(#bunnyFur)"
          stroke="#FFCCD5"
          strokeWidth="1.5"
          filter="url(#softShadow)"
        />

        {/* 3. BLOSSOM HAIRPIN ON LEFT EAR */}
        <g transform="translate(30, 32)">
          {/* 5 Petals */}
          <circle cx="0" cy="-4" r="3" fill="#FF758F" />
          <circle cx="4" cy="-1" r="3" fill="#FF758F" />
          <circle cx="2" cy="4" r="3" fill="#FF758F" />
          <circle cx="-2" cy="4" r="3" fill="#FF758F" />
          <circle cx="-4" cy="-1" r="3" fill="#FF758F" />
          {/* Blossom Center (Monad Purple) */}
          <circle cx="0" cy="0" r="2.2" fill="#836EF9" />
          <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
        </g>

        {/* 4. ROSY BLUSH CHEEKS */}
        <ellipse cx="32" cy="64" rx="5" ry="3.2" fill="#FF85A1" opacity="0.65" />
        <ellipse cx="68" cy="64" rx="5" ry="3.2" fill="#FF85A1" opacity="0.65" />

        {/* 5. EYES & EXPRESSION */}
        {mood === 'happy' || mood === 'victory' ? (
          /* Joyful anime crescent smile eyes */
          <>
            <path
              d="M 32 54 Q 38 48 44 54"
              fill="none"
              stroke="#2F121A"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 56 54 Q 62 48 68 54"
              fill="none"
              stroke="#2F121A"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Twinkle Star */}
            <path
              d="M 74 44 L 75 48 L 79 49 L 75 50 L 74 54 L 73 50 L 69 49 L 73 48 Z"
              fill="#FDE047"
            />
          </>
        ) : mood === 'battle' ? (
          /* Fierce playful warrior eyes */
          <>
            {/* Headband */}
            <path
              d="M 23 48 Q 50 44 77 48"
              fill="none"
              stroke="#FF4D6D"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Monad Logo Badge on Headband */}
            <circle cx="50" cy="46" r="3.5" fill="#836EF9" />
            <path d="M 48 46 L 50 43 L 52 46 L 50 49 Z" fill="#FFFFFF" />

            {/* Left Eye (Determined) */}
            <circle cx="38" cy="56" r="4.5" fill="#2F121A" />
            <circle cx="36.5" cy="54.5" r="1.6" fill="#FFFFFF" />
            {/* Right Eye (Determined) */}
            <circle cx="62" cy="56" r="4.5" fill="#2F121A" />
            <circle cx="60.5" cy="54.5" r="1.6" fill="#FFFFFF" />
          </>
        ) : mood === 'sad' ? (
          /* Cute pouty sad eyes */
          <>
            <circle cx="38" cy="57" r="4.5" fill="#2F121A" />
            <circle cx="39.5" cy="55.5" r="1.8" fill="#FFFFFF" />
            <circle cx="62" cy="57" r="4.5" fill="#2F121A" />
            <circle cx="63.5" cy="55.5" r="1.8" fill="#FFFFFF" />
            {/* Tear drop on right cheek */}
            <ellipse cx="69" cy="66" rx="2" ry="2.8" fill="#38BDF8" opacity="0.85" />
            <circle cx="68.5" cy="65" r="0.8" fill="#FFFFFF" />
          </>
        ) : (
          /* Default Sweet Big Anime Eyes (Idle) */
          <>
            {/* Left Eye */}
            <ellipse cx="38" cy="56" rx="5" ry="6" fill="#2F121A" />
            <circle cx="36.5" cy="54" r="2.2" fill="#FFFFFF" />
            <circle cx="39.5" cy="58" r="1" fill="#FFFFFF" />

            {/* Right Eye */}
            <ellipse cx="62" cy="56" rx="5" ry="6" fill="#2F121A" />
            <circle cx="60.5" cy="54" r="2.2" fill="#FFFFFF" />
            <circle cx="63.5" cy="58" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* 6. NOSE & MOUTH */}
        {mood === 'sad' ? (
          /* Cute little inverted pout */
          <>
            <ellipse cx="50" cy="62" rx="1.8" ry="1.2" fill="#FF758F" />
            <path
              d="M 47 66 Q 50 63 53 66"
              fill="none"
              stroke="#2F121A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        ) : mood === 'happy' || mood === 'victory' ? (
          /* Joyful open D mouth */
          <>
            <ellipse cx="50" cy="62" rx="1.8" ry="1.2" fill="#FF758F" />
            <path
              d="M 46 64 Q 50 71 54 64 Z"
              fill="#E11D48"
              stroke="#2F121A"
              strokeWidth="1.2"
            />
            {/* Tongue */}
            <path
              d="M 48 66 Q 50 69 52 66"
              fill="#FDA4AF"
            />
          </>
        ) : (
          /* Sweet 'w' bunny mouth */
          <>
            <ellipse cx="50" cy="62" rx="1.8" ry="1.2" fill="#FF758F" />
            <path
              d="M 46 64 Q 48 67 50 64 Q 52 67 54 64"
              fill="none"
              stroke="#2F121A"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </>
        )}

        {/* 7. ACCESSORIES (Crown & Trophy for Victory) */}
        {mood === 'victory' && (
          <g>
            {/* Golden Mini Crown on Head */}
            <path
              d="M 42 30 L 40 20 L 46 25 L 50 18 L 54 25 L 60 20 L 58 30 Z"
              fill="url(#goldTrophy)"
              stroke="#CA8A04"
              strokeWidth="1"
            />
            <circle cx="50" cy="24" r="1.2" fill="#836EF9" />
          </g>
        )}
      </svg>
    </div>
  );
};
