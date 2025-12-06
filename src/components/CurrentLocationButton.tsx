

interface CurrentLocationButtonProps {
    onClick: () => void;
    theme?: 'dark' | 'light';
    isNorthUp?: boolean;
}

export default function CurrentLocationButton({ onClick, theme = 'dark', isNorthUp = true }: CurrentLocationButtonProps) {
    const isDark = theme === 'dark';

    return (
        <button
            className={`current-location-button absolute bottom-6 right-6 z-10 p-3 rounded-full shadow-lg backdrop-blur-md border transition-colors md:bottom-8 md:right-8
                ${isDark
                    ? 'bg-black/60 border-white/10 text-white hover:bg-blue-500/80 active:bg-blue-600/80'
                    : 'bg-white/80 border-black/5 text-gray-700 hover:bg-blue-500/80 hover:text-white active:bg-blue-600/80 active:text-white'
                }`}
            onClick={onClick}
            aria-label={isNorthUp ? "現在地へ移動" : "北へ戻す"}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 transition-transform duration-300 ${isNorthUp ? '' : 'rotate-0'}`}>
                {isNorthUp ? (
                    // Location / Navigation Icon
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                ) : (
                    // Compass Icon
                    <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1 1.1-.49 1.1-1.1-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
                )}
            </svg>
            {/* ▲ ここまで ▲ */}
        </button>
    );
}
