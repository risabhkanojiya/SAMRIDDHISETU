'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Partner {
  id: number;
  name: string;
  type: string;
  npa: number;
  distance: number;
  phone: string;
  lat: number;
  lng: number;
  fundUtil: number;
}

interface LocatorMapProps {
  mapCenter: [number, number];
  selectedPartner: Partner | null;
  filteredPartners: Partner[];
  setSelectedPartner: (p: Partner | null) => void;
  setMapCenter: (center: [number, number]) => void;
}

const MapFlyTo = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (typeof map.flyTo === 'function') map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export default function LocatorMap({
  mapCenter,
  selectedPartner,
  filteredPartners,
  setSelectedPartner,
  setMapCenter
}: LocatorMapProps) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={10}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapFlyTo center={mapCenter} zoom={selectedPartner ? 13 : 10} />
      
      {filteredPartners.map((partner) => {
        const icon = L.divIcon({
          html: `
            <div class="relative transition-all duration-300">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                selectedPartner?.id === partner.id
                  ? 'bg-[#013e4e] text-white shadow-emerald-500/40 animate-pulse-glow'
                  : 'bg-white border border-[#e5e7eb] text-[#272727]'
              }">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
              </div>
              ${selectedPartner?.id === partner.id ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#013e4e] rotate-45"></div>' : ''}
            </div>
          `,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        return (
          <Marker 
            key={partner.id} 
            position={[partner.lat, partner.lng]}
            icon={icon}
            eventHandlers={{
              click: () => {
                setSelectedPartner(partner);
                setMapCenter([partner.lat, partner.lng]);
              }
            }}
          />
        );
      })}

      {selectedPartner && (
        <Popup
          position={[selectedPartner.lat, selectedPartner.lng]}
          offset={[0, -40]}
          closeButton={false}
        >
          <div className="px-2 py-1">
            <p className="font-bold text-[#013e4e] text-sm">{selectedPartner.name}</p>
            <p className="text-xs text-[#5a5a5a]">{selectedPartner.type}</p>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
}
