import { useEffect, useState } from 'react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme?: 'dark' | 'light';
}

export default function AboutModal({ isOpen, onClose, theme = 'dark' }: AboutModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-sm transform transition-all duration-300 scale-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    } ${isDark
                        ? 'bg-black/80 border border-white/10 text-white'
                        : 'bg-white/90 border border-black/5 text-gray-900'
                    } backdrop-blur-xl rounded-3xl p-8 shadow-2xl`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-black'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <img
                        src={`${import.meta.env.BASE_URL}logo/Privue_logo_black.png`}
                        alt="Privue Logo"
                        className={`h-16 object-contain transition-opacity duration-300 hover:opacity-70 ${isDark ? 'invert brightness-0' : ''}`}
                    />

                    <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <p className="font-bold text-lg mb-2">
                            About
                        </p>
                        <p className="mb-2">
                            3D都市モデル「PLATEAU」を活用した、夜景探索アプリケーションです。
                        </p>
                        <p>
                            地図上のプロットされたエリアは、選択したランドマークが見える場所を示しています。実際の風景は、ぜひあなたの目で確かめてください。
                        </p>
                        <p className="mt-4 text-xs opacity-60">
                            v1.0.0 | Data source: MLIT PLATEAU
                        </p>
                    </div>

                    <div className="pt-4 w-full">
                        <button
                            onClick={onClose}
                            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${isDark
                                ? 'bg-white text-black hover:bg-gray-300'
                                : 'bg-black text-white hover:bg-gray-700'
                                }`}
                        >
                            探索する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
