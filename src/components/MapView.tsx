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
}

// ソース定義をすっきりさせるために配列化しておきます
const VIEWSHED_SOURCES = [
    { id: 'tokyotower', url: `${R2_BASE_URL}/viewshed_tokyotower_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
    { id: 'skytree', url: `${R2_BASE_URL}/viewshed_skytree_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
    { id: 'docomo', url: `${R2_BASE_URL}/viewshed_docomo_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
    { id: 'tocho', url: `${R2_BASE_URL}/viewshed_tocho_inf_3857_rgba_tiles/{z}/{x}/{y}.png` },
];

export default function MapView({ selectedViewpoints, layerOpacity, center, heading }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            // ▼▼▼ 変更点1: ここでURLを指定するだけでダークモードになります ▼▼▼
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [139.7454, 35.6586],
            zoom: 13,
            attributionControl: false,
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');

        // ▼▼▼ 変更点2: 地図のスタイル読み込み完了「後」にR2レイヤーを追加します ▼▼▼
        map.current.on('load', () => {
            if (!map.current) return;

            VIEWSHED_SOURCES.forEach((source) => {
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

            setIsMapLoaded(true);
        });

        return () => {
            map.current?.remove();
            map.current = null;
            setIsMapLoaded(false);
        };
    }, []);

    // Update Viewpoints and Opacity
    useEffect(() => {
        if (!map.current || !isMapLoaded) return;
        const mapInstance = map.current;

        // レイヤーIDのリスト
        const layers = [
            { id: 'tokyotower-layer', viewpoint: 'tokyoTower' },
            { id: 'skytree-layer', viewpoint: 'skytree' },
            { id: 'docomo-layer', viewpoint: 'docomo' },
            { id: 'tocho-layer', viewpoint: 'tocho' },
        ];

        layers.forEach(layer => {
            // レイヤーが存在するか確認してからプロパティを変更
            if (mapInstance.getLayer(layer.id)) {
                const isSelected = (selectedViewpoints as any).includes(layer.viewpoint);
                const opacity = isSelected ? layerOpacity : 0;
                const visibility = isSelected ? 'visible' : 'none';

                mapInstance.setPaintProperty(layer.id, 'raster-opacity', opacity);
                mapInstance.setLayoutProperty(layer.id, 'visibility', visibility);
            }
        });

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
        <div
            ref={mapContainer}
            className="map-container w-full h-full"
            style={{ width: '100%', height: '100%' }}
        />
    );
}