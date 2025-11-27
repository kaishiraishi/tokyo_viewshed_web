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

export default function MapView({ selectedViewpoints, layerOpacity, center, heading, theme = 'dark' }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

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

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');

        map.current.on('load', () => {
            addLayers();
            setIsMapLoaded(true);
        });

        return () => {
            map.current?.remove();
            map.current = null;
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
        <div
            ref={mapContainer}
            className="map-container w-full h-full"
            style={{ width: '100%', height: '100%' }}
        />
    );
}