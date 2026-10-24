import React from 'react';
import { X, Hand, Zap, Target } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPitchDeck?: () => void;
  onOpenQr?: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onOpenPitchDeck,
  onOpenQr,
}) => {
  const { t, language } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2F121A]/50 backdrop-blur-md animate-fadeIn select-none font-quicksand text-[#2F121A]">
      <div className="relative w-full max-w-md bg-[#FFF8F7] border-2 border-pink-200 rounded-[36px] p-5 shadow-2xl flex flex-col items-center">
        {/* Decorative Bunny Ears on Top of Modal Card */}
        <div className="absolute -top-7 w-32 flex items-center justify-between px-2 pointer-events-none z-0">
          <div className="w-8 h-10 rounded-t-full bg-gradient-to-t from-pink-200 to-white border-2 border-b-0 border-pink-300 shadow-sm flex items-center justify-center p-1">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF758F]/60" />
          </div>
          <div className="w-8 h-10 rounded-t-full bg-gradient-to-t from-pink-200 to-white border-2 border-b-0 border-pink-300 shadow-sm flex items-center justify-center p-1">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF758F]/60" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white border border-pink-200 text-[#574144] hover:text-[#FF4D6D] transition-all shadow-xs cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-center gap-2 mb-1 px-8 text-center relative z-10">
          <span className="text-lg">🌸</span>
          <h3 className="font-comfortaa font-bold text-sm sm:text-base text-[#2F121A] tracking-tight">
            {t.howToPlay.title}
          </h3>
        </div>
        <p className="text-[11px] font-comfortaa font-bold text-[#FF4D6D] text-center mb-4">
          {t.howToPlay.subtitle}
        </p>

        {/* 3 Step Cards */}
        <div className="w-full space-y-2.5 mb-5 text-xs">
          {/* Step 1 */}
          <div className="p-3 rounded-2xl bg-white border border-pink-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-[#FF4D6D]">
              <Hand className="w-4 h-4" />
            </div>
            <div>
              <span className="font-comfortaa font-bold text-xs text-[#2F121A] block mb-0.5">
                {t.howToPlay.step1Title}
              </span>
              <p className="text-[11px] text-[#574144] leading-relaxed">
                {t.howToPlay.step1Desc}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-2xl bg-white border border-pink-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-comfortaa font-bold text-xs text-[#2F121A] block mb-0.5">
                {t.howToPlay.step2Title}
              </span>
              <p className="text-[11px] text-[#574144] leading-relaxed">
                {t.howToPlay.step2Desc}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-2xl bg-white border border-pink-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-[#FF4D6D]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="font-comfortaa font-bold text-xs text-[#2F121A] block mb-0.5">
                {t.howToPlay.step3Title}
              </span>
              <p className="text-[11px] text-[#574144] leading-relaxed">
                {t.howToPlay.step3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF758F] via-[#FF4D6D] to-[#FF758F] text-white font-comfortaa font-bold text-xs tracking-wider shadow-[0_6px_20px_rgba(255,77,109,0.35)] hover:brightness-105 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
        >
          <span>{t.howToPlay.gotItBtn}</span>
        </button>

        {/* Judge & Stage Access */}
        {(onOpenPitchDeck || onOpenQr) && (
          <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-pink-100">
            {onOpenPitchDeck && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPitchDeck();
                }}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10.5px] font-comfortaa font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>📺</span>
                <span>{language === 'id' ? 'Slide Pitch Deck' : 'Pitch Deck'}</span>
              </button>
            )}
            {onOpenQr && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQr();
                }}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#FF4D6D] text-[10.5px] font-comfortaa font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>📱</span>
                <span>{language === 'id' ? 'QR Panggung' : 'Stage QR'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
