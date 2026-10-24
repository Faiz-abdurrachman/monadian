import React from 'react';
import { useLanguage } from '../locales/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-full bg-white/80 border border-[#FBCFE8] p-0.5 text-[11px] font-bold shadow-2xs select-none">
      <button
        onClick={() => setLanguage('id')}
        className={`px-2.5 py-0.5 rounded-full transition-all font-comfortaa font-bold cursor-pointer ${
          language === 'id'
            ? 'bg-[#FF4D6D] text-white shadow-2xs'
            : 'text-[#846875] hover:text-[#2F121A]'
        }`}
        title="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-0.5 rounded-full transition-all font-comfortaa font-bold cursor-pointer ${
          language === 'en'
            ? 'bg-[#FF4D6D] text-white shadow-2xs'
            : 'text-[#846875] hover:text-[#2F121A]'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
};

