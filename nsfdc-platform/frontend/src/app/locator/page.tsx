'use client';

import { useState, useMemo, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { MapPin, Navigation, Phone, AlertTriangle, CheckCircle, Building2, Search, Map as MapIcon, KeyRound } from 'lucide-react';
import dynamic from 'next/dynamic';

const LocatorMap = dynamic(() => import('@/components/LocatorMap'), { ssr: false, loading: () => <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">Loading Map...</div> });

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

const MOCK_PARTNERS: Partner[] = [
  { id: 1, name: 'State Bank SCA Branch', type: 'SCA', npa: 2.1, distance: 3.2, phone: '+91-11-2345-6789', lat: 28.62, lng: 77.22, fundUtil: 78 },
  { id: 2, name: 'Punjab National Bank RRB', type: 'RRB', npa: 3.8, distance: 5.7, phone: '+91-11-3456-7890', lat: 28.64, lng: 77.19, fundUtil: 65 },
  { id: 3, name: 'Bandhan NBFC-MFI', type: 'NBFC-MFI', npa: 1.5, distance: 8.1, phone: '+91-11-4567-8901', lat: 28.59, lng: 77.25, fundUtil: 91 },
  { id: 4, name: 'Karnataka SCA Office', type: 'SCA', npa: 4.2, distance: 12.4, phone: '+91-80-2345-6789', lat: 28.57, lng: 77.18, fundUtil: 42 },
  { id: 5, name: 'Haryana Gramin Bank', type: 'RRB', npa: 2.8, distance: 15.6, phone: '+91-124-345-6789', lat: 28.66, lng: 77.15, fundUtil: 73 },
];

function getNpaColor(npa: number) {
  if (npa <= 2) return { bg: 'bg-emerald-500/10', text: 'text-[#013e4e]', label: 'Excellent' };
  if (npa <= 4) return { bg: 'bg-amber-500/10', text: 'text-[#013e4e]', label: 'Moderate' };
  return { bg: 'bg-red-500/10', text: 'text-red-400', label: 'High Risk' };
}

function getTypeColor(type: string) {
  switch (type) {
    case 'SCA': return 'bg-[#013e4e]/15 text-[#013e4e]';
    case 'RRB': return 'bg-blue-500/15 text-blue-300';
    case 'NBFC-MFI': return 'bg-amber-500/15 text-[#013e4e]';
    default: return 'bg-black/5 text-[#5a5a5a]';
  }
}

export default function LocatorPage() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [maxNpa, setMaxNpa] = useState(5);
  const [locating, setLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);

  const filteredPartners = MOCK_PARTNERS.filter((p) => p.npa <= maxNpa);

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => setLocating(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-hummingbird-gradient">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-emerald-600 mb-4 bg-emerald-50 border border-emerald-100">
            <MapIcon size={14} />
            Live Map Integration Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Find <span className="text-[#013e4e]">Channel Partners</span>
          </h1>
          <p className="text-[#5a5a5a]">Locate the nearest SCA, RRB, or NBFC-MFI with low NPA and available funds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Partner List ── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Controls */}
            <GlassCard hover={false} className="p-4 space-y-4">
              <button
                onClick={handleLocate}
                className="w-full btn-primary flex items-center justify-center gap-2 !py-3"
              >
                <Navigation size={16} className={locating ? 'animate-spin' : ''} />
                {locating ? 'Locating...' : 'Use My Location'}
              </button>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[#5a5a5a]">Max NPA Filter</label>
                  <span className="text-sm font-bold text-[#013e4e]">{maxNpa}%</span>
                </div>
                <input
                  type="range"
                  min={1} max={10} step={0.5}
                  value={maxNpa}
                  onChange={(e) => setMaxNpa(Number(e.target.value))}
                />
              </div>

              <p className="text-xs text-[#9ca3af]">
                Showing {filteredPartners.length} partners with NPA ≤ {maxNpa}%
              </p>
            </GlassCard>

            {/* Partner Cards */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredPartners.map((partner) => {
                const npaInfo = getNpaColor(partner.npa);
                const selected = selectedPartner?.id === partner.id;

                return (
                  <GlassCard
                    key={partner.id}
                    onClick={() => {
                      setSelectedPartner(partner);
                      setMapCenter([partner.lat, partner.lng]);
                    }}
                    className={`p-4 cursor-pointer transition-all ${
                      selected ? '!border-[#013e4e] !bg-[#013e4e]/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#272727] text-sm">{partner.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeColor(partner.type)}`}>
                          {partner.type}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#013e4e]">{partner.distance} km</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#5a5a5a]">
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${npaInfo.text === 'text-[#013e4e]' ? 'bg-emerald-400' : npaInfo.text === 'text-[#013e4e]' ? 'bg-amber-400' : 'bg-red-400'}`} />
                        NPA: {partner.npa}%
                      </div>
                      <div>Fund: {partner.fundUtil}%</div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* ── Right: Map Area ── */}
          <div className="lg:col-span-2 flex flex-col">
            <GlassCard hover={false} className="p-0 overflow-hidden h-[600px] relative rounded-[20px] shadow-sm border border-black/5 bg-white">
                <LocatorMap 
                  mapCenter={mapCenter}
                  selectedPartner={selectedPartner}
                  filteredPartners={filteredPartners}
                  setSelectedPartner={setSelectedPartner}
                  setMapCenter={setMapCenter}
                />
            </GlassCard>

            {/* Selected partner detail */}
            {selectedPartner && (
              <GlassCard hover={false} glow="violet" className="p-6 mt-4 animate-fade-in-up">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#272727] mb-1">{selectedPartner.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedPartner.type)}`}>
                      {selectedPartner.type}
                    </span>
                  </div>
                  <a
                    href={`tel:${selectedPartner.phone}`}
                    className="btn-primary !py-2 !px-4 flex items-center gap-2 text-sm"
                  >
                    <Phone size={14} />
                    Call
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="glass p-3 rounded-xl text-center">
                    <p className="text-xs text-[#5a5a5a]">Distance</p>
                    <p className="text-lg font-bold text-[#013e4e]">{selectedPartner.distance} km</p>
                  </div>
                  <div className="glass p-3 rounded-xl text-center">
                    <p className="text-xs text-[#5a5a5a]">NPA</p>
                    <p className={`text-lg font-bold ${getNpaColor(selectedPartner.npa).text}`}>
                      {selectedPartner.npa}%
                    </p>
                  </div>
                  <div className="glass p-3 rounded-xl text-center">
                    <p className="text-xs text-[#5a5a5a]">Fund Utilization</p>
                    <p className="text-lg font-bold text-[#013e4e]">{selectedPartner.fundUtil}%</p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
