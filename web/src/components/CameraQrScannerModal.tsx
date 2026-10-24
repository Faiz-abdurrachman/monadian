import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, X, RefreshCw, Upload, AlertCircle } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { sounds } from '../engine/audio';

interface CameraQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedData: string) => void;
}

export const CameraQrScannerModal: React.FC<CameraQrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualCode, setManualCode] = useState<string>('');

  // Start Camera Stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setCameraError(null);
    setIsScanning(true);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          language === 'id'
            ? 'Kamera tidak didukung pada browser ini. Silakan unggah foto QR atau masukkan kode kamar.'
            : 'Camera not supported in this browser. Please upload a QR image or enter room code.'
        );
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
      });

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? language === 'id'
            ? 'Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser atau masukkan kode kamar di bawah.'
            : 'Camera permission denied. Please allow camera access in browser settings or enter code below.'
          : err.message || (language === 'id' ? 'Gagal membuka kamera' : 'Failed to access camera')
      );
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setIsScanning(false);
      setCameraError(null);
      setManualCode('');
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Frame Scanning Loop using jsQR
  useEffect(() => {
    if (!isOpen || !isScanning) return;

    let animId: number;

    const tick = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            // QR Code successfully recognized!
            sounds.playPickup();
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([40, 60]);
            }
            setIsScanning(false);
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }
            onScanSuccess(code.data);
            onClose();
            return;
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isScanning, stream, onScanSuccess, onClose]);

  // Handle Image File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            sounds.playPickup();
            onScanSuccess(code.data);
            onClose();
          } else {
            alert(
              language === 'id'
                ? 'QR Code tidak terdeteksi pada gambar ini. Silakan coba gambar lain.'
                : 'No QR code detected in this image. Please try another.'
            );
          }
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Switch between front/back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Submit manual room code
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    sounds.playPickup();
    onScanSuccess(manualCode.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[3px] animate-fadeIn select-none font-quicksand"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[360px] sm:max-w-[385px] flex flex-col items-center"
      >
        {/* Top Bunny Ears */}
        <div className="absolute -top-6 left-0 right-0 flex items-center justify-center gap-5 pointer-events-none z-0">
          <div className="w-7 h-10 rounded-t-full bg-white border-2 border-[#FF758F] shadow-xs flex items-center justify-center pt-2">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF8DA1]/50" />
          </div>
          <div className="w-7 h-10 rounded-t-full bg-white border-2 border-[#FF758F] shadow-xs flex items-center justify-center pt-2">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF8DA1]/50" />
          </div>
        </div>

        {/* Modal Card */}
        <div className="relative z-10 w-full bg-white border-2 border-[#FFD8E3] rounded-[38px] sm:rounded-[42px] pt-7 pb-6 px-5 sm:pt-8 sm:pb-7 sm:px-6 shadow-[0_22px_65px_rgba(255,160,185,0.45)] flex flex-col items-center text-center text-[#241022]">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100/70 border border-[#FFD8E3] text-[#795B6B] flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Title & Subtitle */}
          <div className="flex items-center gap-1.5 mb-1">
            <Camera className="w-5 h-5 text-[#FF3366]" />
            <h2 className="font-comfortaa font-bold text-xl sm:text-2xl text-[#241022] tracking-tight uppercase">
              {language === 'id' ? 'SCAN QR ARENA' : 'SCAN ARENA QR'}
            </h2>
          </div>
          <p className="text-xs font-comfortaa font-medium text-[#795B6B] mb-3">
            {language === 'id'
              ? 'Arahkan kamera ke QR Code host arena turnamen'
              : 'Point your camera at the host tournament QR code'}
          </p>

          {/* Live Camera Viewport */}
          <div className="relative w-full aspect-square max-w-[270px] sm:max-w-[290px] rounded-[28px] overflow-hidden bg-black/95 border-2 border-[#FF758F] shadow-inner flex items-center justify-center mb-3">
            {/* Hidden canvas for jsQR analysis */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Live Video Element */}
            <video
              ref={videoRef}
              muted
              playsInline
              className={`w-full h-full object-cover ${cameraError ? 'hidden' : 'block'}`}
            />

            {/* Viewfinder Target Overlay */}
            {!cameraError && (
              <div className="absolute inset-4 border-2 border-white/50 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-2">
                <div className="w-full flex justify-between">
                  <div className="w-5 h-5 border-t-4 border-l-4 border-[#FF3366] rounded-tl-md" />
                  <div className="w-5 h-5 border-t-4 border-r-4 border-[#FF3366] rounded-tr-md" />
                </div>

                {/* Animated Pulsing Scan Laser Line */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF3366] to-transparent shadow-[0_0_8px_#FF3366] animate-pulse" />

                <div className="w-full flex justify-between">
                  <div className="w-5 h-5 border-b-4 border-l-4 border-[#FF3366] rounded-bl-md" />
                  <div className="w-5 h-5 border-b-4 border-r-4 border-[#FF3366] rounded-br-md" />
                </div>
              </div>
            )}

            {/* Camera Error / Permission Notice */}
            {cameraError && (
              <div className="p-4 text-center flex flex-col items-center justify-center gap-2 text-white">
                <AlertCircle className="w-8 h-8 text-[#FF5C7A]" />
                <p className="text-[11px] font-comfortaa font-bold text-rose-200 leading-tight">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="mt-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{language === 'id' ? 'Coba Lagi' : 'Retry'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions (Switch Camera & File Upload) */}
          <div className="w-full flex items-center justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={toggleFacingMode}
              className="flex-1 py-1.5 px-2.5 rounded-full bg-[#FFF0F4] hover:bg-pink-100/60 border border-[#FCD2DF] text-[11px] font-comfortaa font-bold text-[#A12D4C] flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <RefreshCw className="w-3 h-3 text-[#FF3366]" />
              <span>{language === 'id' ? 'Putar Kamera' : 'Flip Camera'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-1.5 px-2.5 rounded-full bg-[#FFF0F4] hover:bg-pink-100/60 border border-[#FCD2DF] text-[11px] font-comfortaa font-bold text-[#A12D4C] flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Upload className="w-3 h-3 text-[#FF3366]" />
              <span>{language === 'id' ? 'Unggah Foto QR' : 'Upload Image'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Manual Room Code Entry (100% Reliable Fallback) */}
          <form onSubmit={handleManualSubmit} className="w-full flex items-center gap-1.5 pt-1 border-t border-[#FFD8E3]">
            <input
              type="text"
              placeholder={language === 'id' ? 'Atau masukkan kode (cth: 371)' : 'Or enter room code (e.g. 371)'}
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 h-9 rounded-full bg-[#FFF5F8] border border-[#FCD2DF] px-3.5 text-xs font-comfortaa font-bold text-[#241022] placeholder:text-[#A12D4C]/40 focus:outline-none focus:border-[#FF5C7A]"
            />
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="h-9 px-4 rounded-full bg-[#FF5C7A] disabled:opacity-50 text-white font-comfortaa font-bold text-xs uppercase tracking-wider shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
            >
              {language === 'id' ? 'GABUNG' : 'JOIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
