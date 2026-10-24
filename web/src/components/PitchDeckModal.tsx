import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Zap,
  Cpu,
  Trophy,
  ShieldCheck,
  QrCode,
  Flame,
  Radio,
  Layers,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDE_ICONS: React.ReactNode[] = [
  <Zap className="w-6 h-6 text-[#FF4D6D]" key="0" />,
  <Flame className="w-6 h-6 text-rose-500" key="1" />,
  <Trophy className="w-6 h-6 text-amber-500" key="2" />,
  <Layers className="w-6 h-6 text-emerald-500" key="3" />,
  <Cpu className="w-6 h-6 text-[#FF4D6D]" key="4" />,
  <ShieldCheck className="w-6 h-6 text-purple-500" key="5" />,
  <QrCode className="w-6 h-6 text-emerald-500" key="6" />,
  <Radio className="w-6 h-6 text-amber-500" key="7" />,
  <Clock className="w-6 h-6 text-blue-500" key="8" />,
  <Zap className="w-6 h-6 text-[#FF4D6D] animate-bounce" key="9" />,
];

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = t.pitchDeck.slides;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((s) => Math.min(slides.length - 1, s + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((s) => Math.max(0, s - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, slides.length]);

  if (!isOpen) return null;

  const slide = slides[currentSlide] || slides[0];
  const slideIcon = SLIDE_ICONS[currentSlide] || SLIDE_ICONS[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#2F121A]/50 backdrop-blur-xl animate-fadeIn select-none font-quicksand text-[#2F121A]">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-[#FFF8F7] border-2 border-[#FCE7F3] rounded-[36px] shadow-[0_20px_60px_rgba(255,175,190,0.35)] flex flex-col justify-between p-5 sm:p-8 overflow-hidden">
        {/* Decorative Blossom Blobs */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 z-10">
          <div className="flex items-center gap-3">
            <span className="font-comfortaa font-bold text-xs text-[#FF4D6D] tracking-wider uppercase bg-pink-100 border border-pink-200 px-2.5 py-0.5 rounded-full">
              {slide.tag}
            </span>
            <span className="text-[11px] text-[#574144] font-bold">
              {t.pitchDeck.topSub}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white border border-pink-200 hover:bg-pink-50 text-[#574144] hover:text-[#2F121A] transition-all cursor-pointer shadow-xs"
              title={t.pitchDeck.toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-pink-200 hover:bg-pink-50 text-[#574144] hover:text-[#FF4D6D] transition-all cursor-pointer shadow-xs"
              title={t.pitchDeck.closeSlide}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Progress Line */}
        <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden my-2.5 z-10">
          <div
            className="h-full bg-gradient-to-r from-[#FF758F] via-[#FF4D6D] to-[#E61E4F] transition-all duration-300 rounded-full"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Slide Center Content (Stage Aesthetic) */}
        <div className="flex-1 flex flex-col my-auto py-2 sm:py-4 overflow-y-auto pr-1 z-10 scrollbar-none">
          {/* Slide Title & Subtitle */}
          <div className="mb-3 sm:mb-5">
            <div className="flex items-start sm:items-center gap-3 mb-1.5">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#FFF0F3] border-2 border-pink-200 flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5 sm:mt-0">
                {slideIcon}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-comfortaa font-bold text-lg sm:text-2xl md:text-3xl text-[#2F121A] tracking-tight leading-snug sm:leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#FF4D6D] font-bold mt-0.5">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {slide.points.map((pt, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-[#FCE7F3] hover:border-pink-300 transition-all flex flex-col justify-between gap-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-comfortaa font-bold text-sm text-[#2F121A]">
                      {pt.title}
                    </span>
                    {pt.badge && (
                      <span className="text-[9px] bg-pink-100 text-[#FF4D6D] border border-pink-200 px-2 py-0.5 rounded-full font-bold">
                        {pt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#574144] leading-relaxed font-medium">
                    {pt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Punchline Banner */}
          {slide.highlight && (
            <div className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-pink-100/80 via-rose-50 to-pink-50 border-l-4 border-[#FF4D6D] text-xs sm:text-sm font-bold text-[#2F121A] shadow-xs">
              🌸 {slide.highlight}
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-pink-100 z-10">
          <div className="flex items-center gap-2">
            <span className="font-comfortaa font-bold text-sm text-[#FF4D6D]">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-[#574144] font-medium hidden sm:inline">
              {t.pitchDeck.keyboardHint}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
              disabled={currentSlide === 0}
              className="px-3.5 py-2 rounded-xl bg-white border border-pink-200 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-comfortaa font-bold text-[#574144] flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.pitchDeck.prevBtn}</span>
            </button>

            <button
              onClick={() => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#FF758F] via-[#FA436C] to-[#E61E4F] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-comfortaa font-bold text-white flex items-center gap-1 shadow-[0_4px_0_0_#A81B3F] active:translate-y-0.5 active:shadow-[0_1px_0_0_#A81B3F] transition-all cursor-pointer"
            >
              <span>{t.pitchDeck.nextBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
