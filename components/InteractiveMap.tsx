import React, { useEffect, useRef, useState } from 'react';

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  locations?: Array<{
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  }>;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = [15.14, 120.59],
  zoom = 6,
  locations = [
    {
      id: 'ph-facility',
      name: 'Skylar Education Asia - Pampanga Facility',
      address: 'Lot 2 Liwayway St., Cor Habagat, Bagumbayan, Brgy. Cutcut, Angeles City, Pampanga',
      lat: 15.14,
      lng: 120.59
    }
  ]
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // 1. Load CSS
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // 2. Load JS
    const scriptId = 'leaflet-js';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      document.body.appendChild(script);
    }

    const handleScriptLoad = () => {
      setLeafletLoaded(true);
    };

    if (window.hasOwnProperty('L')) {
      setLeafletLoaded(true);
    } else {
      script.addEventListener('load', handleScriptLoad);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', handleScriptLoad);
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Clean up previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: false
    });

    mapInstanceRef.current = map;

    // Add Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom Icon to prevent default image loading issues in Vite/React
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add Markers
    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'Maven Pro', sans-serif; padding: 2px;">
          <h4 style="margin: 0 0 4px 0; color: #041024; font-weight: bold; font-size: 14px;">${loc.name}</h4>
          <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.4;">${loc.address}</p>
        </div>
      `);
    });

    // Trigger window resize event to force Leaflet to recalculate container size
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, center, zoom, locations]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-100/80 shadow-md">
      {!leafletLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
          <div className="flex flex-col items-center gap-2">
            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading Interactive Map...</span>
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-10" />
    </div>
  );
};

export { InteractiveMap };
export default InteractiveMap;
