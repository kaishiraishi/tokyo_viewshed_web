import MapView from './components/MapView';
import LayerMenu from './components/LayerMenu';
import CurrentLocationButton from './components/CurrentLocationButton';
import { useMapViewState } from './hooks/useMapViewState';

function App() {
  const {
    selectedViewpoint,
    setSelectedViewpoint,
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
      {/* Side Menu for PC / Bottom Sheet for Mobile */}
      <LayerMenu
        selectedViewpoint={selectedViewpoint}
        layerOpacity={layerOpacity}
        onSelectViewpoint={setSelectedViewpoint}
        onChangeOpacity={setLayerOpacity}
        isOpen={isLayerMenuOpen}
        onOpen={openLayerMenu}
        onClose={closeLayerMenu}
      />

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        <MapView
          selectedViewpoint={selectedViewpoint}
          layerOpacity={layerOpacity}
          center={currentLocation}
          heading={heading}
        />

        {/* Current Location FAB - only show when menu is closed */}
        {!isLayerMenuOpen && (
          <CurrentLocationButton onClick={locateMe} />
        )}

        {/* Floating Action Button for Mobile to open menu if closed */}
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
