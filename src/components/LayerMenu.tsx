import type { SelectedViewpoint } from '../types/map';

const R2_BASE_URL = 'https://pub-270c6735fbc041bdb5476aaf4093cf55.r2.dev';

interface LayerMenuProps {
    selectedViewpoints: SelectedViewpoint[];
    layerOpacity: number;
    onToggleViewpoint: (viewpoint: SelectedViewpoint) => void;
    onChangeOpacity: (value: number) => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    // 複数選択モード
    isMultiSelectMode?: boolean;
    onToggleMultiSelectMode?: () => void;
}

const VIEWPOINT_CARDS: { id: SelectedViewpoint; label: string; imageUrl?: string; subtitle?: string }[] = [
    { id: 'tokyoTower', label: '東京タワー', imageUrl: `${R2_BASE_URL}/layer_photo/tokyotower.jpg`, subtitle: '港区 / 333m' },
    { id: 'skytree', label: '東京スカイツリー', imageUrl: `${R2_BASE_URL}/layer_photo/tokyoskytree.webp`, subtitle: '墨田区 / 634m' },
    { id: 'docomo', label: 'ドコモタワー', imageUrl: `${R2_BASE_URL}/layer_photo/docomotower.jpg`, subtitle: '渋谷区 / 240m' },
    { id: 'tocho', label: '都庁', imageUrl: `${R2_BASE_URL}/layer_photo/tocho.jpg`, subtitle: '新宿区 / 243m' },
];

export default function LayerMenu({
    selectedViewpoints,
    layerOpacity,
    onToggleViewpoint,
    onChangeOpacity,
    isOpen,
    onOpen,
    onClose,
    isMultiSelectMode = false,
    onToggleMultiSelectMode,
}: LayerMenuProps) {
    return (
        <>
            {/* モバイル用バックドロップ */}
            {isOpen && <div className="layer-menu-backdrop fixed inset-0 bg-black/30 z-20 md:hidden" onClick={onClose} />}

            <div className={`layer-menu-container fixed bottom-0 left-0 right-0 bg-white z-30 transition-transform duration-300 ease-in-out md:relative md:transform-none md:w-80 md:h-full md:shadow-lg flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-55px)] md:translate-y-0'}`}>

                {/* モバイル用ハンドル */}
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

                {/* メインコンテンツ */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* ▼ コントロールエリア（ヘッダー・透明度）をグループ化 ▼ */}
                    <div className="mb-6 space-y-6">
                        {/* 1. ヘッダー: ロゴのみ */}
                        <div className="flex items-center justify-start">
                            <img
                                src={`${import.meta.env.BASE_URL}logo/Privue_logo_black.png`}
                                alt="Privue Logo"
                                className="h-10 md:h-12 object-contain"
                            />
                        </div>

                        {/* 2. 透明度スライダー */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">透明度</h3> {/* テキスト変更 */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={layerOpacity}
                                    onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="w-10 text-right text-sm text-gray-500 font-medium">
                                    {Math.round(layerOpacity * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ▼ カードリストヘッダー：選択レイヤー + 複数選択ボタン ▼ */}
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-500">選択レイヤー</h3>
                        {onToggleMultiSelectMode && (
                            <button
                                onClick={onToggleMultiSelectMode}
                                aria-pressed={isMultiSelectMode}
                                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-200 border ${
                                    isMultiSelectMode
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                }`}
                            >
                                複数選択
                            </button>
                        )}
                    </div>

                    {/* ▼ カードリストエリア ▼ */}
                    <div className="layer-menu-card-list flex space-x-4 overflow-x-auto pb-4 md:flex-col md:space-x-0 md:space-y-3">
                        {VIEWPOINT_CARDS.map((card) => {
                            const isActive = selectedViewpoints.includes(card.id);

                            return (
                                <button
                                    key={card.id}
                                    onClick={() => onToggleViewpoint(card.id)}
                                    className={`relative flex-shrink-0 w-32 aspect-square rounded-xl overflow-hidden border transition-all duration-200 md:w-full md:h-auto md:aspect-video ${
                                        isActive ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {/* 背景画像 */}
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

                                    {/* グラデーションオーバーレイ */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* ラベルテキスト */}
                                    <div className="absolute bottom-2 right-2 text-right text-white drop-shadow-md">
                                        <div className="text-xs font-medium">{card.label}</div>
                                        {card.subtitle && (
                                            <div className="text-[10px] opacity-80">{card.subtitle}</div>
                                        )}
                                    </div>

                                    {/* チェックマーク (常時表示・色変化) */}
                                    <div
                                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-colors duration-200 ${isActive ? 'bg-blue-500' : 'bg-black/30 border border-white/50'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/70'}`}
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
