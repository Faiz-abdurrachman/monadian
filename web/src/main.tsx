import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './locales/LanguageContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Monadian React Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-screen bg-[#FFF8F7] text-[#2F121A] flex flex-col items-center justify-center p-6 text-center font-quicksand">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF758F] to-[#FF4D6D] flex items-center justify-center font-black text-3xl shadow-md mb-4 text-white">
            🌸
          </div>
          <h1 className="font-comfortaa font-bold text-xl text-[#2F121A] tracking-wider mb-2 uppercase">
            MONADIAN
          </h1>
          <p className="text-[#574144] text-xs max-w-xs mb-5 leading-relaxed font-medium">
            Terjadi kendala saat memuat grafik di perangkat Anda. Ketuk tombol di bawah untuk melanjutkan game.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-b from-[#FF758F] to-[#E61E4F] font-comfortaa font-bold text-sm text-white shadow-[0_4px_0_0_#A81B3F] active:translate-y-0.5 active:shadow-[0_1px_0_0_#A81B3F] transition-all cursor-pointer"
          >
            Muat Ulang Permainan
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
