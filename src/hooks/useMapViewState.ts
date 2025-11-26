import { useState, useCallback } from 'react';
import type { SelectedViewpoint } from '../types/map';

export function useMapViewState() {
	// 選択状態（複数選択対応）
	const [selectedViewpoints, setSelectedViewpoints] = useState<SelectedViewpoint[]>(['tokyoTower']);
	const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);

	const [layerOpacity, setLayerOpacity] = useState<number>(0.7);
	const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);
	const [currentLocation, setCurrentLocation] = useState<{ lng: number; lat: number } | null>(null);
	const [heading, setHeading] = useState<number | null>(null);

	const openLayerMenu = useCallback(() => setIsLayerMenuOpen(true), []);
	const closeLayerMenu = useCallback(() => setIsLayerMenuOpen(false), []);
	const toggleLayerMenu = useCallback(() => setIsLayerMenuOpen((prev) => !prev), []);

	// ▼ 追加: 複数選択モードの切り替え関数
	const toggleMultiSelectMode = useCallback(() => {
		setIsMultiSelectMode((prev) => !prev);
	}, []);

	// ▼ 変更: モードによって挙動を変える
	const handleViewpointClick = useCallback(
		(viewpoint: SelectedViewpoint) => {
			setSelectedViewpoints((prev) => {
				// 'none' (クリア) は全解除
				if (viewpoint === 'none') {
					return [];
				}

				if (isMultiSelectMode) {
					// 複数選択モード ON: トグル（追加/削除）
					if (prev.includes(viewpoint)) {
						return prev.filter((v) => v !== viewpoint);
					} else {
						return [...prev, viewpoint];
					}
				} else {
					// 複数選択モード OFF: 単一選択（入れ替え）
					// 既に選択されている場合でもそのまま単一にする（2回目で解除したい場合はここを調整）
					return [viewpoint];
				}
			});
		},
		[isMultiSelectMode]
	);

	const locateMe = useCallback(() => {
		if (!('geolocation' in navigator)) {
			alert('Geolocation is not supported by your browser');
			return;
		}

		const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

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
			navigator.geolocation.getCurrentPosition(handleSuccess, (e) => console.error(e), { enableHighAccuracy: false });
		};

		navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
	}, []);

	return {
		selectedViewpoints,
		toggleViewpoint: handleViewpointClick, // 既存の名前を維持してモード別挙動へ
		isMultiSelectMode, // 追加
		toggleMultiSelectMode, // 追加
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
