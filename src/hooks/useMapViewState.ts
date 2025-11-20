import { useState, useCallback } from 'react';
import type { SelectedViewpoint } from '../types/map';

export function useMapViewState() {
    const [selectedViewpoint, setSelectedViewpoint] = useState<SelectedViewpoint>('tokyoTower');
    const [layerOpacity, setLayerOpacity] = useState<number>(0.7);
    const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);
    const [currentLocation, setCurrentLocation] = useState<{ lng: number; lat: number } | null>(null);
    const [heading, setHeading] = useState<number | null>(null);

    const openLayerMenu = useCallback(() => setIsLayerMenuOpen(true), []);
    const closeLayerMenu = useCallback(() => setIsLayerMenuOpen(false), []);
    const toggleLayerMenu = useCallback(() => setIsLayerMenuOpen((prev) => !prev), []);

    const locateMe = useCallback(() => {
        if (!('geolocation' in navigator)) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        const handleSuccess = (position: GeolocationPosition) => {
            const { longitude, latitude, heading: deviceHeading } = position.coords;
            setCurrentLocation({ lng: longitude, lat: latitude });

            if (deviceHeading !== null && deviceHeading !== undefined && !isNaN(deviceHeading)) {
                setHeading(deviceHeading);
            } else {
                setHeading(0);
            }
        };

        const handleError = (error: GeolocationPositionError) => {
            console.warn('High accuracy geolocation failed, trying low accuracy...', error);

            // Fallback to low accuracy
            navigator.geolocation.getCurrentPosition(
                handleSuccess,
                (fallbackError) => {
                    console.error('Error getting location:', fallbackError);
                    alert('Unable to retrieve your location. Please ensure location services are enabled.');
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    }, []);

    return {
        selectedViewpoint,
        setSelectedViewpoint,
        layerOpacity,
        setLayerOpacity,
        isLayerMenuOpen,
        openLayerMenu,
        closeLayerMenu,
        toggleLayerMenu,
        currentLocation,
        heading,
        setHeading,
        locateMe,
    };
}
