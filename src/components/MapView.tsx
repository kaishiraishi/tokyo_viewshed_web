import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { SelectedViewpoint } from '../types/map';

interface MapViewProps {
    selectedViewpoint: SelectedViewpoint;
    layerOpacity: number;
    center: { lng: number; lat: number } | null;
    heading: number | null;
}

export default function MapView({ selectedViewpoint, layerOpacity, center, heading }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

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
                    tokyotower: {
                        type: 'raster',
                        tiles: ['/viewshed_tokyotower_inf_3857_rgba_tiles/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: 'Tokyo Tower Data',
                    },
                    skytree: {
                        type: 'raster',
                        tiles: ['/viewshed_skytree_inf_3857_rgba_tiles/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: 'Tokyo Skytree Data'
                    },
                    docomo: {
                        type: 'raster',
                        tiles: ['/viewshed_docomo_inf_3857_rgba_tiles/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: 'Docomo Tower Data'
                    },
                    tocho: {
                        type: 'raster',
                        tiles: ['/viewshed_tocho_inf_3857_rgba_tiles/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: 'Tocho Data'
                    }
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
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Cleanup
        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Update Viewpoint and Opacity
    useEffect(() => {
        if (!map.current) return;
        const mapInstance = map.current;

        // Wait for style to load if needed, but simple raster layers usually work immediately if source is added.
        // Better to check if style is loaded or use 'styledata' event if complex.
        // For now, we assume map is ready or we check style.getLayer.

        const layers = [
            { id: 'tokyotower-layer', viewpoint: 'tokyoTower' },
            { id: 'skytree-layer', viewpoint: 'skytree' },
            { id: 'docomo-layer', viewpoint: 'docomo' },
            { id: 'tocho-layer', viewpoint: 'tocho' },
        ];

        layers.forEach(layer => {
            if (mapInstance.getLayer(layer.id)) {
                const isSelected = selectedViewpoint === layer.viewpoint;
                const opacity = isSelected ? layerOpacity : 0;
                const visibility = isSelected ? 'visible' : 'none';

                mapInstance.setPaintProperty(layer.id, 'raster-opacity', opacity);
                mapInstance.setLayoutProperty(layer.id, 'visibility', visibility);
            }
        });

    }, [selectedViewpoint, layerOpacity]);

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
        markerElement.className = 'location-arrow';

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
