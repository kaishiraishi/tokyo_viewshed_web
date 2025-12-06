import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { SelectedViewpoint } from '../types/map';

const R2_BASE_URL = 'https://pub-270c6735fbc041bdb5476aaf4093cf55.r2.dev';

interface MapViewProps {
    selectedViewpoints: SelectedViewpoint[];
    layerOpacity: number;
    center: { lng: number; lat: number } | null;
    heading: number | null;
    theme?: 'dark' | 'light';
}

// ソース定義をすっきりさせるために配列化しておきます
const VIEWSHED_SOURCES = [
    { id: 'tokyotower', url: `${R2_BASE_URL}/viewshed_tokyotower_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
    { id: 'skytree', url: `${R2_BASE_URL}/viewshed_skytree_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
    { id: 'docomo', url: `${R2_BASE_URL}/viewshed_docomo_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
    { id: 'tocho', url: `${R2_BASE_URL}/viewshed_tocho_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
];

// 各建物の座標
const BUILDING_LOCATIONS = [
    { id: 'tokyotower', name: '東京タワー', lng: 139.7454, lat: 35.6586, icon: 'tower_icon/tokyotower_icon.png' },
    { id: 'skytree', name: '東京スカイツリー', lng: 139.8107, lat: 35.7101, icon: 'tower_icon/skytree_icon.png' },
    { id: 'docomo', name: 'NTTドコモ代々木ビル', lng: 139.6997, lat: 35.6825, icon: 'tower_icon/docomotower_icon.png' },
    { id: 'tocho', name: '東京都庁', lng: 139.6917, lat: 35.6896, icon: 'tower_icon/tocho_icon.png' },
];

export default function MapView({ selectedViewpoints, layerOpacity, center, heading, theme = 'dark' }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);
    const clickMarker = useRef<maplibregl.Marker | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [clickedCoord, setClickedCoord] = useState<{ lng: number; lat: number } | null>(null);

    // レイヤーを追加する関数
    const addLayers = () => {
        if (!map.current) return;

        VIEWSHED_SOURCES.forEach((source) => {
            if (map.current!.getSource(source.id)) return; // 既にある場合はスキップ

            // ソースを追加
            map.current!.addSource(source.id, {
                type: 'raster',
                tiles: [source.url],
                tileSize: 256,
            });

            // レイヤーを追加
            map.current!.addLayer({
                id: `${source.id}-layer`,
                type: 'raster',
                source: source.id,
                paint: {
                    'raster-opacity': 0, // 初期状態は透明
                },
                layout: {
                    visibility: 'none' // 初期状態は非表示
                }
            });
        });

        // レイヤーの状態を更新（再適用）
        updateLayerState();
    };

    // レイヤーの状態（表示・不透明度）を更新する関数
    const updateLayerState = () => {
        if (!map.current) return;
        const mapInstance = map.current;

        const layers = [
            { id: 'tokyotower-layer', viewpoint: 'tokyoTower' },
            { id: 'skytree-layer', viewpoint: 'skytree' },
            { id: 'docomo-layer', viewpoint: 'docomo' },
            { id: 'tocho-layer', viewpoint: 'tocho' },
        ];

        layers.forEach(layer => {
            if (mapInstance.getLayer(layer.id)) {
                const isSelected = (selectedViewpoints as any).includes(layer.viewpoint);
                const opacity = isSelected ? layerOpacity : 0;
                const visibility = isSelected ? 'visible' : 'none';

                mapInstance.setPaintProperty(layer.id, 'raster-opacity', opacity);
                mapInstance.setLayoutProperty(layer.id, 'visibility', visibility);
            }
        });
    };

    // 建物マーカーを追加する関数
    const addBuildingMarkers = () => {
        if (!map.current) return;

        BUILDING_LOCATIONS.forEach((building) => {
            // マーカー用のカスタム要素を作成
            const el = document.createElement('div');
            el.className = 'building-marker';

            // base パスを考慮してURLを生成（各建物のアイコンを使用）
            const iconUrl = `${import.meta.env.BASE_URL}${building.icon}`;
            el.innerHTML = `<img src="${iconUrl}" alt="${building.name}" />`;

            // ポップアップを作成
            const popup = new maplibregl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: false,
            }).setHTML(`
                <div class="building-popup">
                    <div class="font-bold">${building.name}</div>
                </div>
            `);

            // マーカーを追加
            new maplibregl.Marker({
                element: el,
                anchor: 'bottom',
            })
                .setLngLat([building.lng, building.lat])
                .setPopup(popup)
                .addTo(map.current!);
        });
    };

    // Initialize Map
    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        const styleUrl = theme === 'dark'
            ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
            : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: [139.7454, 35.6586],
            zoom: 13,
            attributionControl: false,
        });

        map.current.on('load', () => {
            addLayers();
            addBuildingMarkers();
            setIsMapLoaded(true);
        });

        // クリックイベント: ピンを立てて座標を保存
        map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;

            // 座標を state に保存
            setClickedCoord({ lng, lat });

            // GoogleマップのURL
            const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

            // 既存のクリックマーカーがあれば削除
            if (clickMarker.current) {
                clickMarker.current.remove();
            }

            // カスタム要素を作る（絵文字ピン）
            const pinEl = document.createElement('div');
            pinEl.className = 'click-pin';
            pinEl.textContent = '📍';

            // ポップアップを作成
            const popup = new maplibregl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: false,
            }).setHTML(`
                <div class="click-popup text-xs">
                    <div class="font-bold mb-1">ここへいく</div>
                    <a
                        href="${googleMapsUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline text-blue-400 hover:text-blue-300"
                    >
                        Lng: ${lng.toFixed(5)}, Lat: ${lat.toFixed(5)}
                    </a>
                </div>
            `);

            // 新しいマーカーをクリック位置に立てる
            clickMarker.current = new maplibregl.Marker({
                element: pinEl,
                anchor: 'bottom',
            })
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map.current!);

            // ピンをクリックしたときにポップアップを表示
            pinEl.addEventListener('click', (event) => {
                event.stopPropagation(); // マップのクリックイベントを防ぐ
                clickMarker.current?.togglePopup();
            });
        });

        return () => {
            map.current?.remove();
            map.current = null;
            marker.current?.remove();
            clickMarker.current?.remove();
            setIsMapLoaded(false);
        };
    }, []);

    // Theme Change Effect
    useEffect(() => {
        if (!map.current) return;

        const styleUrl = theme === 'dark'
            ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
            : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

        map.current.setStyle(styleUrl);

        // スタイル変更後にレイヤーを再追加
        map.current.once('styledata', () => {
            addLayers();
        });
    }, [theme]);

    // Update Viewpoints and Opacity
    useEffect(() => {
        if (!map.current || !isMapLoaded) return;
        updateLayerState();
    }, [selectedViewpoints, layerOpacity, isMapLoaded]);

    // Update Center (Geolocation)
    useEffect(() => {
        if (!map.current || !center) return;

        map.current.flyTo({
            center: [center.lng, center.lat],
            zoom: 16,
            speed: 1.2,
        });

        if (marker.current) {
            marker.current.remove();
        }

        const markerElement = document.createElement('div');
        markerElement.className = 'user-location-dot';

        marker.current = new maplibregl.Marker({
            element: markerElement,
            anchor: 'center'
        })
            .setLngLat([center.lng, center.lat])
            .addTo(map.current);

    }, [center]);

    // Update Heading
    useEffect(() => {
        if (!marker.current || heading === null) return;
        const markerElement = marker.current.getElement();
        if (markerElement) {
            markerElement.style.transform = `rotate(${heading}deg)`;
        }
    }, [heading]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={mapContainer}
                className="map-container w-full h-full"
                style={{ width: '100%', height: '100%' }}
            />

            {clickedCoord && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    Lng: {clickedCoord.lng.toFixed(5)}, Lat: {clickedCoord.lat.toFixed(5)}
                </div>
            )}
        </div>
    );
}