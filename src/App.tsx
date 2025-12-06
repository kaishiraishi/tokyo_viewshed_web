import { useState } from 'react';
import MapView from './components/MapView';
import LayerMenu from './components/LayerMenu';
import CurrentLocationButton from './components/CurrentLocationButton';
import { useMapViewState } from './hooks/useMapViewState';
import LegendPanel from './components/LegendPanel';
import ScoringDetailsModal from './components/ScoringDetailsModal';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);

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
    mapBearing,
    handleRotate,
    northResetTrigger,
  } = useMapViewState();

  const isNorthUp = Math.abs(mapBearing) < 5;

  return (
    <div className="app-container relative w-full h-[100dvh] overflow-hidden">
      <ScoringDetailsModal
        isOpen={isScoringModalOpen}
        onClose={() => setIsScoringModalOpen(false)}
        theme={theme}
      />

      {/* Map Container */}
      <div className="relative w-full h-full">
        <MapView
          selectedViewpoints={selectedViewpoints}
          layerOpacity={layerOpacity}
          center={currentLocation}
          heading={heading}
          theme={theme}
          onSelectViewpoint={toggleViewpoint}
          northResetTrigger={northResetTrigger}
          onRotate={handleRotate}
        />

        {/* Legend Panel (Floating) */}
        <LegendPanel
          theme={theme}
          selectedViewpoints={selectedViewpoints}
          onOpenDetails={() => setIsScoringModalOpen(true)}
        />

        {/* Current Location Button (Floating) */}
        {!isLayerMenuOpen && (
          <CurrentLocationButton onClick={locateMe} theme={theme} isNorthUp={isNorthUp} />
        )}

        {/* Layer Menu (Floating/Bottom Sheet) */}
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
          currentLocation={currentLocation}
        />
      </div>
    </div>
  );
}

export default App;