import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { SelectedViewpoint } from '../types/map';

// ▼▼▼ ここをあなたのR2のURL（https://pub-....r2.dev）に書き換えてください ▼▼▼
const R2_BASE_URL = 'https://pub-270c6735fbc041bdb5476aaf4093cf55.r2.dev';
// ▲▲▲ 末尾にスラッシュ(/)は不要です ▲▲▲

interface MapViewProps {
    // 【変更】配列を受け取る
    selectedViewpoints: SelectedViewpoint[];
    layerOpacity: number;
    center: { lng: number; lat: number } | null;
    heading: number | null;
}

export default function MapView({ selectedViewpoints, layerOpacity, center, heading }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    // 【追加】地図の読み込み完了を管理するステート
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [
                            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        ],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap Contributors',
                    },
                    // ▼▼▼ ここからR2を参照するように変更しました ▼▼▼
                    tokyotower: {
                        type: 'raster',
                        tiles: [`${R2_BASE_URL}/viewshed_tokyotower_inf_3857_rgba_tiles/{z}/{x}/{y}.png`],
                        tileSize: 256,
                    },
                    skytree: {
                        type: 'raster',
                        tiles: [`${R2_BASE_URL}/viewshed_skytree_inf_3857_rgba_tiles/{z}/{x}/{y}.png`],
                        tileSize: 256,
                    },
                    docomo: {
                        type: 'raster',
                        tiles: [`${R2_BASE_URL}/viewshed_docomo_inf_3857_rgba_tiles/{z}/{x}/{y}.png`],
                        tileSize: 256,
                    },
                    tocho: {
                        type: 'raster',
                        tiles: [`${R2_BASE_URL}/viewshed_tocho_inf_3857_rgba_tiles/{z}/{x}/{y}.png`],
                        tileSize: 256,
                    }
                    // ▲▲▲ 変更ここまで ▲▲▲
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                    },
                    {
                        id: 'tokyotower-layer',
                        type: 'raster',
                        source: 'tokyotower',
                        paint: {
                            'raster-opacity': 0,
                        },
                        layout: {
                            visibility: 'none'
                        }
                    },
                    {
                        id: 'skytree-layer',
                        type: 'raster',
                        source: 'skytree',
                        paint: {
                            'raster-opacity': 0,
                        },
                        layout: {
                            visibility: 'none'
                        }
                    },
                    {
                        id: 'docomo-layer',
                        type: 'raster',
                        source: 'docomo',
                        paint: {
                            'raster-opacity': 0,
                        },
                        layout: {
                            visibility: 'none'
                        }
                    },
                    {
                        id: 'tocho-layer',
                        type: 'raster',
                        source: 'tocho',
                        paint: {
                            'raster-opacity': 0,
                        },
                        layout: {
                            visibility: 'none'
                        }
                    },
                ],
            },
            center: [139.7454, 35.6586], // Tokyo Tower
            zoom: 13,
            attributionControl: false, // デフォルトの表示は消す（手動で追加するため）
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        // 左上(top-left)ではなく「右下(bottom-right)」にします。
        // compact: false にすることで、「i」アイコンではなく最初から文字を表示させます。
        map.current.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');

        // 【追加】地図のスタイル読み込み完了イベントを検知してフラグを立てる
        map.current.on('load', () => {
            setIsMapLoaded(true);
        });

        // Cleanup
        return () => {
            map.current?.remove();
            map.current = null;
            setIsMapLoaded(false);
        };
    }, []);

    // Update Viewpoints and Opacity (ここを修正)
    useEffect(() => {
        if (!map.current || !isMapLoaded) return;
        const mapInstance = map.current;

        const layers = [
            { id: 'tokyotower-layer', viewpoint: 'tokyoTower' },
            { id: 'skytree-layer', viewpoint: 'skytree' },
            { id: 'docomo-layer', viewpoint: 'docomo' },
            { id: 'tocho-layer', viewpoint: 'tocho' },
        ];

        layers.forEach(layer => {
            if (mapInstance.getLayer(layer.id)) {
                // 【変更】配列に含まれているかどうかで判定
                // 型チェックを避けるため any キャスト
                const isSelected = (selectedViewpoints as any).includes(layer.viewpoint);

                const opacity = isSelected ? layerOpacity : 0;
                const visibility = isSelected ? 'visible' : 'none';

                mapInstance.setPaintProperty(layer.id, 'raster-opacity', opacity);
                mapInstance.setLayoutProperty(layer.id, 'visibility', visibility);
            }
        });

    }, [selectedViewpoints, layerOpacity, isMapLoaded]); // 【変更】依存配列も修正

    // Update Center (Geolocation)
    useEffect(() => {
        if (!map.current || !center) return;

        map.current.flyTo({
            center: [center.lng, center.lat],
            zoom: 16,
            speed: 1.2,
        });

        // Remove old marker if exists
        if (marker.current) {
            marker.current.remove();
        }

        // Create HTML element for marker
        const markerElement = document.createElement('div');
        // Google Maps風の青い丸（白フチ・パルス）に変更
        markerElement.className = 'user-location-dot';

        // Create marker with custom element
        marker.current = new maplibregl.Marker({
            element: markerElement,
            anchor: 'center'
        })
            .setLngLat([center.lng, center.lat])
            .addTo(map.current);

    }, [center]);

    // Update Heading (Rotation)
    useEffect(() => {
        if (!marker.current || heading === null) return;

        const markerElement = marker.current.getElement();
        if (markerElement) {
            markerElement.style.transform = `rotate(${heading}deg)`;
        }
    }, [heading]);

    return (
        <div
            ref={mapContainer}
            className="map-container w-full h-full"
            style={{ width: '100%', height: '100%' }}
        />
    );
}