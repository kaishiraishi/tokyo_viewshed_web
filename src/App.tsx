import { useState } from 'react';
import MapView from './components/MapView';
import LayerMenu from './components/LayerMenu';
import CurrentLocationButton from './components/CurrentLocationButton';
import { useMapViewState } from './hooks/useMapViewState';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const {
    selectedViewpoints,
    toggleViewpoint,
    isMultiSelectMode,
    toggleMultiSelectMode,
    layerOpacity,
    setLayerOpacity,
    isLayerMenuOpen,
    openLayerMenu,
    closeLayerMenu,
    currentLocation,
    heading,
    locateMe,
  } = useMapViewState();

  return (
    <div className="app-container flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <LayerMenu
        selectedViewpoints={selectedViewpoints}
        layerOpacity={layerOpacity}
        onToggleViewpoint={toggleViewpoint}
        onChangeOpacity={setLayerOpacity}
        isOpen={isLayerMenuOpen}
        onOpen={openLayerMenu}
        onClose={closeLayerMenu}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelectMode={toggleMultiSelectMode}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 relative h-full">
        <MapView
          selectedViewpoints={selectedViewpoints}
          layerOpacity={layerOpacity}
          center={currentLocation}
          heading={heading}
          theme={theme}
        />

        {/* CurrentLocationButtonだけを残します */}
        {!isLayerMenuOpen && (
          <CurrentLocationButton onClick={locateMe} theme={theme} />
        )}

        {/* 削除しました: メニューを開くためのフローティングボタン */}
      </div>
    </div>
  );
}

export default App;