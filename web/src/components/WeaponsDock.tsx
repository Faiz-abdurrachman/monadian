import React from 'react';
import { Target, Skull, Snowflake } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface WeaponsDockProps {
  mana: number;
  onFireGlitchStone: () => void;
  onFireToxicHand: () => void;
  onFireFrostLock: () => void;
  targetName: string;
}

export const WeaponsDock: React.FC<WeaponsDockProps> = ({
  mana,
  onFireGlitchStone,
  onFireToxicHand,
  onFireFrostLock,
  targetName,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[390px] mx-auto flex flex-col gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-[28px] border-2 border-pink-100 shadow-xs select-none font-quicksand">
      {/* Target indicator pill */}
      <div className="flex justify-between items-center px-1 text-[9px] font-comfortaa font-bold">
        <span className="text-[#574144] uppercase tracking-wider">⚡ {t.weapons.title}</span>
        <span className="text-[#FF4D6D] bg-pink-50 border border-pink-200/60 px-2 py-0.5 rounded-full">🎯 {targetName}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Weapon 1: Glitch (30 Mana) */}
        <button
          data-weapon-type="glitch"
          onClick={onFireGlitchStone}
          disabled={mana < 30}
          title={mana >= 30 ? t.weapons.glitchDesc : t.weapons.insufficientMana}
          className={`flex items-center justify-center gap-1.5 h-10 rounded-full transition-all duration-150 px-2 ${
            mana >= 30
              ? 'bg-gradient-to-b from-[#7DD3FC] via-[#38BDF8] to-[#0284C7] text-white shadow-[0_3px_0_0_#0369A1,0_6px_14px_rgba(2,132,199,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0369A1] cursor-pointer font-bold'
              : 'bg-pink-50/70 border border-pink-200/60 text-[#574144] opacity-60 cursor-not-allowed'
          }`}
        >
          <Target className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[10px] font-comfortaa font-bold truncate">
            {t.weapons.glitchName}
          </span>
          <span className="text-[8.5px] font-mono font-bold opacity-90">30</span>
        </button>

        {/* Weapon 2: Toxic (60 Mana) */}
        <button
          data-weapon-type="toxic"
          onClick={onFireToxicHand}
          disabled={mana < 60}
          title={mana >= 60 ? t.weapons.toxicDesc : t.weapons.insufficientMana}
          className={`flex items-center justify-center gap-1.5 h-10 rounded-full transition-all duration-150 px-2 ${
            mana >= 60
              ? 'bg-gradient-to-b from-[#FF758F] via-[#FA436C] to-[#E11D48] text-white shadow-[0_3px_0_0_#9F1239,0_6px_14px_rgba(225,29,72,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#9F1239] cursor-pointer font-bold'
              : 'bg-pink-50/70 border border-pink-200/60 text-[#574144] opacity-60 cursor-not-allowed'
          }`}
        >
          <Skull className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[10px] font-comfortaa font-bold truncate">
            {t.weapons.toxicName}
          </span>
          <span className="text-[8.5px] font-mono font-bold opacity-90">60</span>
        </button>

        {/* Weapon 3: Frost (90 Mana) */}
        <button
          data-weapon-type="frost"
          onClick={onFireFrostLock}
          disabled={mana < 90}
          title={mana >= 90 ? t.weapons.frostDesc : t.weapons.insufficientMana}
          className={`flex items-center justify-center gap-1.5 h-10 rounded-full transition-all duration-150 px-2 ${
            mana >= 90
              ? 'bg-gradient-to-b from-[#C4B5FD] via-[#818CF8] to-[#4F46E5] text-white shadow-[0_3px_0_0_#3730A3,0_6px_14px_rgba(79,70,229,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#3730A3] cursor-pointer font-bold'
              : 'bg-pink-50/70 border border-pink-200/60 text-[#574144] opacity-60 cursor-not-allowed'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[10px] font-comfortaa font-bold truncate">
            {t.weapons.frostName}
          </span>
          <span className="text-[8.5px] font-mono font-bold opacity-90">90</span>
        </button>
      </div>
    </div>
  );
};
