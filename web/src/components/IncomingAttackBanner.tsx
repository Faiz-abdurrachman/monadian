import React from 'react';
import { CombatAttack } from '../engine/combatEngine';
import { Zap, Skull, Snowflake } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface IncomingAttackBannerProps {
  pendingAttacks: CombatAttack[];
}

export const IncomingAttackBanner: React.FC<IncomingAttackBannerProps> = ({
  pendingAttacks,
}) => {
  const { t } = useLanguage();
  if (pendingAttacks.length === 0) return null;

  const latest = pendingAttacks[pendingAttacks.length - 1];

  const getAttackInfo = () => {
    switch (latest.type) {
      case 'blossom':
        return {
          icon: <span className="text-sm animate-bounce">🌸</span>,
          title: `BLOSSOM STRIKE: ${latest.senderName}`,
          desc: `Diserang ${latest.senderName}! Blok sabotase tertanam!`,
          bg: 'bg-[#FFF0F4] border-2 border-[#FF758F] text-[#881337] shadow-[0_4px_15px_rgba(255,92,122,0.25)]',
        };
      case 'toxic':
        return {
          icon: <Skull className="w-3.5 h-3.5 text-rose-500 animate-bounce" />,
          title: `${t.weapons.toxicName}: ${latest.senderName}`,
          desc: t.combat.toxicAlert(latest.senderName),
          bg: 'bg-[#FFF0F5] border-2 border-rose-300 text-rose-900 shadow-[0_4px_15px_rgba(244,63,94,0.2)]',
        };
      case 'frost':
        return {
          icon: <Snowflake className="w-3.5 h-3.5 text-indigo-500 animate-spin" />,
          title: `${t.weapons.frostName}: ${latest.senderName}`,
          desc: t.combat.frostAlert(latest.senderName),
          bg: 'bg-[#EFF6FF] border-2 border-indigo-300 text-indigo-900 shadow-[0_4px_15px_rgba(99,102,241,0.2)]',
        };
      case 'glitch':
      default:
        return {
          icon: <Zap className="w-3.5 h-3.5 text-[#0369A1] animate-pulse" />,
          title: `${t.weapons.glitchName}: ${latest.senderName}`,
          desc: t.combat.glitchAlert(latest.senderName),
          bg: 'bg-[#F0F9FF] border-2 border-sky-300 text-sky-900 shadow-[0_4px_15px_rgba(14,165,233,0.2)]',
        };
    }
  };

  const info = getAttackInfo();

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-[340px] pointer-events-none transition-all duration-300 animate-bounce">
      <div
        className={`px-3 py-1.5 rounded-2xl border backdrop-blur-md flex items-center gap-2 ${info.bg}`}
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-xl bg-white flex items-center justify-center border border-pink-100 shadow-xs">
          {info.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-comfortaa font-bold text-[9.5px] tracking-wide uppercase truncate">
              {info.title}
            </span>
            <span className="text-[7.5px] font-comfortaa font-bold uppercase tracking-wider bg-pink-100 text-[#FF4D6D] border border-pink-200 px-1.5 py-0.2 rounded-full">
              INBOX
            </span>
          </div>
          <p className="text-[8.5px] text-[#574144] truncate leading-tight font-medium">
            {info.desc}
          </p>
        </div>
      </div>
    </div>
  );
};
