import { useState } from 'react';

interface CurrentLocationButtonProps {
    onClick: () => void;
    isDisabled?: boolean;
}

export default function CurrentLocationButton({ onClick, isDisabled = false }: CurrentLocationButtonProps) {
    const [isRaised, setIsRaised] = useState(false);

    const handleClick = () => {
        setIsRaised(true);
        onClick();
    };

    const handleMouseEnter = () => {
        setIsRaised(true);
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            disabled={isDisabled}
            className={`current-location-button fixed z-20 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${isRaised ? 'current-location-button--raised' : ''
                }`}
            aria-label="Find my location"
        >
            {/* Navigation Icon (SVG) */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                />
            </svg>
        </button>
    );
}
