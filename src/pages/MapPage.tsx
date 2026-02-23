import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { mockToilets, NAGPUR_CENTER, getNearbyAlternatives, getDistance } from '@/data/toiletData';
import { ToiletFacility, FilterOptions } from '@/types/toilet';
import { LEDDisplay } from '@/components/LEDDisplay';
import { SensorDashboard } from '@/components/SensorDashboard';
import { ToiletCard } from '@/components/ToiletCard';
import { FilterPanel } from '@/components/FilterPanel';
import { NearbyAlternatives } from '@/components/NearbyAlternatives';
import { GradeBadge } from '@/components/GradeBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, LayoutDashboard, Navigation, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const MAPS_API_KEY = 'AIzaSyDxgvUw_WKq0fXjBjCXCKSb8b5_wvDOn68';

const mapContainerStyle = { width: '100%', height: '100%' };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5f7f5' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d7e8' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e0e6e0' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4edda' }] },
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  ],
};

const gradeMarkerColors: Record<string, string> = {
  A: '#22a05b',
  B: '#6d9a23',
  C: '#e6a817',
  D: '#e05252',
};

export default function MapPage() {
  const { isLoaded } = useJsApiLoader({ id: 'google-map', googleMapsApiKey: MAPS_API_KEY });

  const { signOut } = useAuth();
  const [selectedToilet, setSelectedToilet] = useState<ToiletFacility | null>(null);
  const [infoWindow, setInfoWindow] = useState<ToiletFacility | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    grades: [],
    accessibility: null,
    freeOnly: false,
    openOnly: false,
  });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const filteredToilets = useMemo(() => {
    return mockToilets.filter(t => {
      if (filters.grades.length > 0 && !filters.grades.includes(t.grade)) return false;
      if (filters.accessibility && !t.isAccessible) return false;
      if (filters.freeOnly && !t.isFree) return false;
      if (filters.openOnly && t.operationalStatus !== 'open') return false;
      if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !t.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).map(t => ({
      ...t,
      distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, t.lat, t.lng) : undefined,
    }));
  }, [filters, searchQuery, userLocation]);

  const alternatives = useMemo(() => {
    if (!selectedToilet) return [];
    if (selectedToilet.grade === 'C' || selectedToilet.grade === 'D' || selectedToilet.operationalStatus !== 'open') {
      return getNearbyAlternatives(selectedToilet, mockToilets);
    }
    return [];
  }, [selectedToilet]);

  const handleMarkerClick = useCallback((toilet: ToiletFacility) => {
    setInfoWindow(toilet);
    setSelectedToilet(toilet);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full gradient-hero animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="gradient-hero px-4 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-primary-foreground lg:hidden">
            {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-primary-foreground font-bold text-lg leading-tight">🚽 HygieneIQ</h1>
            <p className="text-primary-foreground/70 text-[10px]">AI-Powered Public Toilet Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button size="sm" variant="secondary" className="text-xs gap-1 h-8">
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Button>
          </Link>
          <Button size="sm" variant="secondary" className="text-xs gap-1 h-8" onClick={signOut}>
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-card border-r border-border flex flex-col z-10 absolute lg:relative h-full"
            >
              {/* Search */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by area or name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded ${showFilters ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <div className="p-3 border-b border-border">
                    <FilterPanel filters={filters} onChange={setFilters} onClose={() => setShowFilters(false)} />
                  </div>
                )}
              </AnimatePresence>

              {/* Toilet List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  {filteredToilets.length} facilities found
                </div>
                {filteredToilets.map(toilet => (
                  <ToiletCard
                    key={toilet.id}
                    toilet={toilet}
                    onSelect={(t) => {
                      setSelectedToilet(t);
                      setInfoWindow(t);
                    }}
                  />
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Map */}
        <div className="flex-1 relative">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={NAGPUR_CENTER}
            zoom={13}
            options={mapOptions}
          >
            {filteredToilets.map(toilet => (
              <MarkerF
                key={toilet.id}
                position={{ lat: toilet.lat, lng: toilet.lng }}
                onClick={() => handleMarkerClick(toilet)}
                icon={{
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                  fillColor: gradeMarkerColors[toilet.grade],
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                  scale: 1.5,
                  anchor: new google.maps.Point(12, 22),
                }}
              />
            ))}

            {infoWindow && (
              <InfoWindowF
                position={{ lat: infoWindow.lat, lng: infoWindow.lng }}
                onCloseClick={() => setInfoWindow(null)}
              >
                <div className="p-2 min-w-[200px] font-display">
                  <div className="flex items-center gap-2 mb-2">
                    <GradeBadge grade={infoWindow.grade} score={infoWindow.hygieneScore} size="sm" />
                    <div>
                      <div className="font-semibold text-sm">{infoWindow.name}</div>
                      <div className="text-xs text-gray-500">{infoWindow.address}</div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Score: <strong>{infoWindow.hygieneScore}/100</strong></div>
                    <div>Rating: ⭐ {infoWindow.userRating}</div>
                    <div>{infoWindow.isFree ? '✅ Free' : '💰 Paid'} • {infoWindow.isAccessible ? '♿ Accessible' : ''}</div>
                  </div>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${infoWindow.lat},${infoWindow.lng}`, '_blank')}
                    style={{ background: 'linear-gradient(135deg, #22a05b, #3b8ed4)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', marginTop: '8px', cursor: 'pointer', width: '100%' }}
                  >
                    📍 Directions
                  </button>
                </div>
              </InfoWindowF>
            )}

            {userLocation && (
              <MarkerF
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#3b8ed4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3,
                  scale: 8,
                }}
              />
            )}
          </GoogleMap>

          {/* Floating LED Display */}
          <AnimatePresence>
            {selectedToilet && (
              <div className="absolute top-4 right-4 w-64 space-y-3 z-10">
                <LEDDisplay grade={selectedToilet.grade} score={selectedToilet.hygieneScore} name={selectedToilet.name} />
                <SensorDashboard toilet={selectedToilet} />
                {alternatives.length > 0 && (
                  <NearbyAlternatives
                    alternatives={alternatives}
                    reason={
                      selectedToilet.operationalStatus !== 'open'
                        ? `This facility is ${selectedToilet.operationalStatus}. Here are nearby alternatives:`
                        : `Grade ${selectedToilet.grade} — Consider these cleaner alternatives nearby:`
                    }
                    onSelect={(t) => { setSelectedToilet(t); setInfoWindow(t); }}
                  />
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Locate Me Button */}
          <button
            onClick={() => {
              navigator.geolocation?.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => alert('Unable to get your location')
              );
            }}
            className="absolute bottom-6 right-4 bg-card border border-border rounded-full p-3 shadow-elevated hover:shadow-card transition-shadow z-10"
          >
            <Navigation className="w-5 h-5 text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}
