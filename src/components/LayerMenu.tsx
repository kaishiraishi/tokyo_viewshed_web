import type { SelectedViewpoint } from '../types/map';

interface LayerMenuProps {
    selectedViewpoint: SelectedViewpoint;
    layerOpacity: number;
    onSelectViewpoint: (viewpoint: SelectedViewpoint) => void;
    onChangeOpacity: (value: number) => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

// ▼ Cloudflare R2 base URL (same as used in MapView.tsx)
const R2_BASE_URL = 'https://pub-270c6735fbc041bdb5476aaf4093cf55.r2.dev';

const VIEWPOINT_CARDS: { id: SelectedViewpoint; label: string; imageUrl?: string }[] = [
    { id: 'tokyoTower', label: 'Tokyo Tower', imageUrl: `${R2_BASE_URL}/layer_photo/tokyotower.jpg` },
    { id: 'skytree', label: 'Tokyo Skytree', imageUrl: `${R2_BASE_URL}/layer_photo/tokyoskytree.webp` },
    { id: 'docomo', label: 'Docomo Tower', imageUrl: `${R2_BASE_URL}/layer_photo/docomotower.jpg` },
    { id: 'tocho', label: 'Tocho', imageUrl: `${R2_BASE_URL}/layer_photo/tocho.jpg` },
    { id: 'none', label: 'None' },
];

export default function LayerMenu({
    selectedViewpoint,
    layerOpacity,
    onSelectViewpoint,
    onChangeOpacity,
    isOpen,
    onOpen,
    onClose,
}: LayerMenuProps) {
    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="layer-menu-backdrop fixed inset-0 bg-black/30 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`layer-menu-container fixed bottom-0 left-0 right-0 bg-white z-30 transition-transform duration-300 ease-in-out md:relative md:transform-none md:w-80 md:h-full md:shadow-lg flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-55px)] md:translate-y-0'
                    }`}
            >
                {/* Handle (Mobile only) */}
                <div
                    className="layer-menu-handle h-[55px] flex items-center justify-center cursor-pointer border-t border-gray-200 md:hidden"
                    onClick={isOpen ? onClose : onOpen}
                >
                    <div className="flex flex-col items-center">
                        <div className="layer-menu-handle-bar w-10 h-1 bg-gray-300 rounded-full mb-2" />
                        <span className="layer-menu-handle-label text-sm text-gray-600 font-medium">
                            {isOpen ? '下に押して閉じる' : 'レイヤー選択'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h2 className="text-lg font-bold mb-4 hidden md:block">Viewshed Layers</h2>

                    {/* Layer Selection */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Select Viewpoint</h3>
                        <div className="layer-menu-card-list flex space-x-4 overflow-x-auto pb-2 md:flex-col md:space-x-0 md:space-y-2">
                            {VIEWPOINT_CARDS.map((card) => {
                                const isActive = selectedViewpoint === card.id;
                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => onSelectViewpoint(card.id)}
                                        className={`relative flex-shrink-0 w-32 aspect-square rounded-xl overflow-hidden border transition-all duration-200 md:w-full md:h-auto md:aspect-video ${isActive
                                            ? 'border-blue-500 ring-2 ring-blue-300'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {/* Image Background */}
                                        {card.imageUrl ? (
                                            <img
                                                src={card.imageUrl}
                                                alt={card.label}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-4xl opacity-20">🚫</span>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Label */}
                                        <span className="absolute bottom-2 right-2 text-xs font-medium text-white drop-shadow-md">
                                            {card.label}
                                        </span>

                                        {/* Active Indicator (Optional checkmark) */}
                                        {isActive && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Opacity Slider */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Layer Opacity</h3>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={layerOpacity}
                            onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {Math.round(layerOpacity * 100)}%
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
