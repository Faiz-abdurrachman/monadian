import React from 'react';
import { useLanguage } from '../locales/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-full bg-[#FFF0F1] border border-[#FBCFE8] p-0.5 text-[9px] font-bold shadow-xs select-none">
      <button
        onClick={() => setLanguage('id')}
        className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 font-comfortaa ${
          language === 'id'
            ? 'bg-gradient-to-r from-[#FF758F] to-[#FF4D6D] text-white shadow-xs font-bold'
            : 'text-[#574144] hover:text-[#2F121A]'
        }`}
        title="Bahasa Indonesia"
      >
        <span className="text-[10px]">🇮🇩</span>
        <span className="font-mono font-black">ID</span>
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 font-comfortaa ${
          language === 'en'
            ? 'bg-gradient-to-r from-[#FF758F] to-[#FF4D6D] text-white shadow-xs font-bold'
            : 'text-[#574144] hover:text-[#2F121A]'
        }`}
        title="English"
      >
        <span className="text-[10px]">🇬🇧</span>
        <span className="font-mono font-black">EN</span>
      </button>
    </div>
  );
};
