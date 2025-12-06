import { useEffect, useState } from 'react';

interface ScoringDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme?: 'dark' | 'light';
}

export default function ScoringDetailsModal({ isOpen, onClose, theme = 'dark' }: ScoringDetailsModalProps) {
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
                className={`relative w-[90vw] md:max-w-3xl transform transition-all duration-300 scale-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    } ${isDark
                        ? 'bg-black/90 border border-white/10 text-white'
                        : 'bg-white/95 border border-black/5 text-gray-900'
                    } backdrop-blur-xl rounded-3xl py-6 md:py-10 shadow-2xl`}
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
                    <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <p className="font-bold text-lg mb-4">
                            夜景スコア算出の詳細
                        </p>
                        <div className="w-full rounded-xl overflow-hidden shadow-lg mb-2">
                            <img
                                src={`${import.meta.env.BASE_URL}plateau_nightview.png`}
                                alt="Nightview Score"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    <div className="pt-4 w-full">
                        <button
                            onClick={onClose}
                            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${isDark
                                ? 'bg-white text-black hover:bg-gray-300'
                                : 'bg-black text-white hover:bg-gray-700'
                                }`}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
