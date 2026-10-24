import React from 'react';
import { Zap, Flame, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface HUDProps {
  score: number;
  mana: number;
  comboStreak: number;
  timeLeft: number;
  aliveCount: number;
  totalPlayers: number;
  isMuted: boolean;
  onToggleMute: () => void;
  incomingSabotageCount: number;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  mana,
  comboStreak,
  timeLeft,
  aliveCount,
  totalPlayers,
  isMuted,
  onToggleMute,
  incomingSabotageCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[390px] mx-auto flex items-center justify-between gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border-2 border-pink-100 shadow-xs select-none font-quicksand">
      {/* Left: Alive Indicator */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200/60 text-[9.5px] font-comfortaa font-bold text-[#2F121A]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{aliveCount}/{totalPlayers}</span>
      </div>

      {/* Center: Score & Combo & Timer */}
      <div className="flex items-center gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-[9px] font-comfortaa font-bold text-[#FF4D6D] uppercase">
            {t.hud.score}
          </span>
          <span className="font-comfortaa font-bold text-base text-[#2F121A] tracking-tight">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Combo Badge (if active) */}
        {comboStreak > 1 && (
          <div className="flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-[#FF4D6D] to-rose-400 rounded-full text-white text-[9px] font-comfortaa font-bold animate-bounce shadow-xs">
            <Flame className="w-3 h-3 fill-white" />
            <span>{comboStreak}x</span>
          </div>
        )}

        {/* Sabotage Incoming Warning */}
        {incomingSabotageCount > 0 && (
          <div className="flex items-center gap-0.5 px-2 py-0.5 bg-rose-100 border border-rose-300 rounded-full text-[#FF4D6D] text-[9px] font-bold animate-bounce">
            <ShieldAlert className="w-3 h-3" />
            <span>+{incomingSabotageCount}</span>
          </div>
        )}

        {/* 60s Round Timer */}
        <div
          className={`px-2.5 py-0.5 rounded-full font-comfortaa font-bold text-xs tracking-tight border transition-all ${
            timeLeft <= 10
              ? 'bg-rose-100 border-[#FF4D6D] text-[#FF4D6D] animate-pulse font-black'
              : 'bg-pink-50/70 border-pink-200/60 text-[#2F121A]'
          }`}
        >
          ⏳ {timeLeft}s
        </div>
      </div>

      {/* Right: Mana + Mute Button */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200/60 text-[9.5px] font-comfortaa font-bold text-[#FF4D6D]">
          <Zap className="w-3 h-3 fill-[#FF4D6D] text-[#FF4D6D]" />
          <span className="font-mono font-bold text-[#2F121A]">{mana}</span>
        </div>

        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-[#574144] active:scale-90 transition-all shadow-xs cursor-pointer"
          title={isMuted ? t.hud.unmute : t.hud.mute}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF4D6D]" />}
        </button>
      </div>
    </div>
  );
};
