import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { MonaBunnyMascot } from './MonaBunnyMascot';

interface LobbyQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LobbyQRModal: React.FC<LobbyQRModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const localLanUrl = 'http://192.168.1.114:3000';
  const currentUrl =
    typeof window !== 'undefined' && window.location.origin.includes('localhost')
      ? localLanUrl
      : typeof window !== 'undefined'
      ? window.location.href
      : localLanUrl;

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      currentUrl,
      {
        width: 220,
        margin: 1.5,
        color: {
          dark: '#2F121A',
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error('QR code generation error:', error);
      }
    );
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F121A]/50 backdrop-blur-sm animate-fadeIn select-none font-quicksand text-[#2F121A]">
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white border border-pink-200 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(255,140,165,0.25)] flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-[#574144] hover:text-[#FF4D6D] transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-3 flex flex-col items-center">
          <MonaBunnyMascot mood="happy" size={44} showAura={false} className="mb-1" />
          <h3 className="font-fredoka font-bold text-base text-[#2F121A] tracking-tight">
            {language === 'id' ? 'Scan untuk Gabung Lobi' : 'Scan to Join Lobby'}
          </h3>
          <p className="text-xs font-jakarta text-[#8A6B73] font-medium mt-0.5">
            {language === 'id'
              ? 'Arahkan kamera smartphone ke QR'
              : 'Point smartphone camera at QR code'}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl border-2 border-pink-100 shadow-xs mb-4">
          <canvas ref={canvasRef} className="rounded-xl block" />
        </div>

        {/* Action Button: Salin Tautan */}
        <button
          type="button"
          onClick={handleCopy}
          className="w-full h-11 rounded-full bg-gradient-to-r from-[#FF758F] via-[#FF4D6D] to-[#E61E4F] text-white font-comfortaa font-bold text-xs tracking-wide shadow-[0_4px_16px_rgba(255,77,109,0.3)] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>{language === 'id' ? 'Tautan Berhasil Disalin!' : 'Link Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>{language === 'id' ? 'Salin Tautan Lobi' : 'Copy Lobby Link'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
