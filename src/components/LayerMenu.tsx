import { useRef } from 'react';
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
    isMultiSelectMode?: boolean;
    onToggleMultiSelectMode?: () => void;
    theme?: 'dark' | 'light';
    onToggleTheme?: () => void;
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
    theme = 'dark',
    onToggleTheme,
}: LayerMenuProps) {
    // ▼▼▼ ドラッグ操作用のRef ▼▼▼
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number>(0);
    const isDraggingRef = useRef(false);

    // ハンドルの高さ（閉じたときに見えている部分）
    const HANDLE_HEIGHT = 55;

    // ポインター（マウス・タッチ）開始
    const handlePointerDown = (e: React.PointerEvent) => {
        // スクロール等を防ぐ（タッチデバイスで重要）
        // ただし touch-action: none がCSSにあれば基本不要だが念のため
        // e.preventDefault(); // ReactのPointerEventで呼ぶと警告が出る場合があるが、touch-actionで制御するのが基本

        e.currentTarget.setPointerCapture(e.pointerId);
        touchStartY.current = e.clientY;
        isDraggingRef.current = true;

        // 即座にtransitionを無効化して追従性を高める
        if (containerRef.current) {
            containerRef.current.style.transition = 'none';
        }
    };

    // ポインター移動
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        if (!containerRef.current) return;

        const currentY = e.clientY;
        const diff = currentY - touchStartY.current;

        // メニュー全体の高さ
        const menuHeight = containerRef.current.offsetHeight;
        const closedOffset = menuHeight - HANDLE_HEIGHT;

        let newTranslateY = 0;

        if (isOpen) {
            // Open時: 0px から下(プラス)へ動く
            newTranslateY = Math.max(0, diff);
        } else {
            // Closed時: closedOffset から上(マイナス)へ動く
            // diffはマイナスになるはず
            newTranslateY = Math.max(0, closedOffset + diff);
        }

        containerRef.current.style.transform = `translateY(${newTranslateY}px)`;
    };

    // ポインター終了
    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);

        if (!containerRef.current) return;

        // インラインスタイルを削除してCSSクラスの制御に戻す
        containerRef.current.style.transform = '';
        containerRef.current.style.transition = '';

        const endY = e.clientY;
        const diff = endY - touchStartY.current;
        const THRESHOLD = 50; // 50px以上動かしたら反応

        if (Math.abs(diff) < 5) {
            // 移動がほぼない場合はクリック（タップ）とみなしてトグル
            if (isOpen) onClose();
            else onOpen();
            return;
        }

        if (isOpen) {
            // 開いている時: 下に大きく動かしたら閉じる
            if (diff > THRESHOLD) onClose();
        } else {
            // 閉じている時: 上に大きく動かしたら開く
            if (diff < -THRESHOLD) onOpen();
        }
    };

    const isDark = theme === 'dark';

    return (
        <>
            {/* モバイル用バックドロップ */}
            {isOpen && <div className="layer-menu-backdrop fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onClose} />}

            <div
                ref={containerRef}
                /* ▼▼▼ 変更: クラス制御 ▼▼▼ */
                /* transition-none はJSでインライン制御するため、基本クラスには transition-transform を入れておく */
                className={`layer-menu-container fixed bottom-0 left-0 right-0 z-30
                    ${isDark ? 'bg-black/60 text-white border-white/10' : 'bg-white/80 text-gray-900 border-black/5'}
                    backdrop-blur-md
                    transition-transform duration-300 ease-in-out
                    md:relative md:transform-none md:w-80 md:h-full shadow-2xl rounded-t-2xl md:rounded-2xl flex flex-col border
                    ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-55px)] md:translate-y-0'}`
                }
            >

                {/* モバイル用ハンドルエリア（ここをドラッグ領域にする） */}
                <div
                    className="layer-menu-handle h-[55px] flex items-center justify-center cursor-pointer md:hidden touch-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <div className="flex flex-col items-center pointer-events-none">
                        <div className={`layer-menu-handle-bar w-10 h-1 rounded-full ${isDark ? 'bg-white/30' : 'bg-black/20'}`} />
                    </div>
                </div>

                {/* メインコンテンツ */}
                <div className="flex-1 overflow-y-auto p-4">

                    <div className="mb-6 space-y-6">
                        {/* 1. ヘッダー: ロゴとテーマ切り替え */}
                        <div className="flex items-center justify-between">
                            <img
                                src={`${import.meta.env.BASE_URL}logo/Privue_logo_black.png`}
                                alt="Privue Logo"
                                className={`h-12 object-contain transition-all duration-300 ${isDark ? 'invert brightness-0' : ''}`}
                            />

                            {onToggleTheme && (
                                <button
                                    onClick={onToggleTheme}
                                    className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-black/5 hover:bg-black/10 text-orange-500'}`}
                                    aria-label="Toggle theme"
                                >
                                    {isDark ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* 2. 透明度スライダー */}
                        <div>
                            <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Layer Opacity</h3>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={layerOpacity}
                                    onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
                                    className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
                                />
                                <div className={`w-10 text-right text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {Math.round(layerOpacity * 100)}%
                                </div>
                            </div>
                        </div>
                        {/* 3. レイヤー選択セクション */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Select Layer</h3>
                                {onToggleMultiSelectMode && (
                                    <button
                                        onClick={onToggleMultiSelectMode}
                                        aria-pressed={isMultiSelectMode}
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-200 border ${isMultiSelectMode
                                            ? 'bg-blue-500/30 text-blue-300 border-blue-400/50'
                                            : isDark
                                                ? 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
                                                : 'bg-black/5 text-gray-600 border-black/10 hover:bg-black/10'
                                            }`}
                                    >
                                        複数選択
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* カードリストエリア */}
                    <div className="layer-menu-card-list flex space-x-4 overflow-x-auto p-4 md:flex-col md:space-x-0 md:space-y-3">
                        {VIEWPOINT_CARDS.map((card) => {
                            const isActive = selectedViewpoints.includes(card.id);

                            return (
                                <button
                                    key={card.id}
                                    onClick={() => onToggleViewpoint(card.id)}
                                    className={`relative flex-shrink-0 w-32 aspect-square rounded-xl overflow-hidden transition-all duration-300 md:w-full md:h-auto md:aspect-video shadow-lg hover:shadow-2xl hover:-translate-y-1 group ${isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''
                                        }`}
                                >
                                    {/* 背景画像 */}
                                    {card.imageUrl ? (
                                        <img
                                            src={card.imageUrl}
                                            alt={card.label}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center">
                                            <span className="text-4xl opacity-20">🚫</span>
                                        </div>
                                    )}

                                    {/* 黒の半透明オーバーレイ */}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                                    {/* グラデーションオーバーレイ */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    {/* ラベルテキスト */}
                                    <div className="absolute bottom-2 right-2 text-right text-white drop-shadow-md">
                                        <div className="text-xs font-medium">{card.label}</div>
                                        {card.subtitle && (
                                            <div className="text-[10px] opacity-80">{card.subtitle}</div>
                                        )}
                                    </div>

                                    {/* チェックマーク */}
                                    <div
                                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${isActive ? 'bg-blue-500 scale-110' : 'bg-black/40 border border-white/30 backdrop-blur-sm'
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
