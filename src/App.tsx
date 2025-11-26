import MapView from './components/MapView';
import LayerMenu from './components/LayerMenu';
import CurrentLocationButton from './components/CurrentLocationButton';
import { useMapViewState } from './hooks/useMapViewState';

function App() {
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
      />

      <div className="flex-1 relative h-full">
        <MapView
          selectedViewpoints={selectedViewpoints}
          layerOpacity={layerOpacity}
          center={currentLocation}
          heading={heading}
        />

        {!isLayerMenuOpen && (
          <CurrentLocationButton onClick={locateMe} />
        )}

        {!isLayerMenuOpen && (
          <button
            className="md:hidden absolute bottom-6 right-6 z-10 bg-white p-3 rounded-full shadow-lg"
            onClick={openLayerMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
