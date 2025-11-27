import React from 'react';

interface CurrentLocationButtonProps {
    onClick: () => void;
}

export default function CurrentLocationButton({ onClick }: CurrentLocationButtonProps) {
    return (
        <button
            className="current-location-button absolute bottom-6 right-6 z-10 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors md:bottom-8 md:right-8"
            onClick={onClick}
            aria-label="現在地へ移動"
        >
            {/* ▼ Google Material Symbols: assistant_navigation のSVG ▼ */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                {/* ▼▼▼ 以前の <path d="M9 6.75..." /> を削除して、以下に書き換え ▼▼▼ */}
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {/* ▲ ここまで ▲ */}
        </button>
    );
}
