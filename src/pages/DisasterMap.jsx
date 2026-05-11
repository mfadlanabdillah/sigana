import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import {
  Satellite,
  Map,
  Mountain,
  Moon,
  Sun,
  Filter,
  ZoomIn,
  ZoomOut,
  Layers,
} from 'lucide-react';
import {
  mockDisasters,
  mockEvacuationCenters,
  disasterTypes,
  centerTypes,
  statusConfig,
} from '../lib/data';
import { DisasterBadge, SeverityBadge } from '../components/disasters/DisasterBadge';
import AppLayout from '../components/layout/AppLayout';
import 'leaflet/dist/leaflet.css';

const JABAR_CENTER = [-6.9, 107.6];
const JABAR_BOUNDS = [[-7.85, 105.1], [-5.9, 109.3]];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const tileLayers = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri',
    icon: Satellite,
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: 'OpenStreetMap',
    icon: Map,
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'OpenTopoMap',
    icon: Mountain,
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: 'CartoDB',
    icon: Moon,
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: 'CartoDB',
    icon: Sun,
  },
};

const createDisasterIcon = (type, status) => {
  const typeInfo = disasterTypes[type] || { emoji: '⚠️' };
  const pulseClass = status === 'aktif' ? 'animate-pulse' : '';
  return L.divIcon({
    html: `<div class="relative ${pulseClass}" style="font-size: 24px; text-align: center; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${typeInfo.emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    className: 'custom-disaster-marker',
  });
};

const createCenterIcon = (type, status) => {
  const typeInfo = centerTypes[type] || { emoji: '🏠' };
  const color = status === 'penuh' ? '#EF4444' : status === 'aktif' ? '#10B981' : '#6B7280';
  return L.divIcon({
    html: `<div style="font-size: 20px; text-align: center; line-height: 1;">${typeInfo.emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: 'custom-center-marker',
  });
};

function MapController({ zoom }) {
  const map = useMap();
  return null;
}

export default function DisasterMap() {
  const [activeLayer, setActiveLayer] = useState('street');
  const [showDisasters, setShowDisasters] = useState(true);
  const [showCenters, setShowCenters] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(9);
  const [mapRef, setMapRef] = useState(null);

  const filteredDisasters =
    statusFilter === 'all'
      ? mockDisasters
      : mockDisasters.filter((d) => d.status === statusFilter);

  const activeAlerts = mockDisasters.filter(
    (d) => d.status === 'aktif' || d.status === 'siaga'
  );

  return (
    <AppLayout title="Peta Bencana">
      <div className="relative h-[calc(100vh-8rem)]">
        <MapContainer
          center={JABAR_CENTER}
          zoom={9}
          bounds={JABAR_BOUNDS}
          scrollWheelZoom
          className="h-full w-full rounded-xl"
          ref={setMapRef}
          whenReady={(map) => {
            setZoomLevel(map.target.getZoom());
          }}
        >
          <TileLayer
            attribution={tileLayers[activeLayer].attribution}
            url={tileLayers[activeLayer].url}
          />

          {showDisasters && (
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={(cluster) => {
                const count = cluster.getChildCount();
                let size = 'small';
                if (count > 10) size = 'medium';
                if (count > 25) size = 'large';
                return L.divIcon({
                  html: `<div class="custom-marker-cluster custom-marker-cluster-${size}">${count}</div>`,
                  className: '',
                  iconSize: L.point(40, 40),
                });
              }}
            >
              {filteredDisasters.map((disaster) => (
                <Marker
                  key={disaster.id}
                  position={[disaster.latitude, disaster.longitude]}
                  icon={createDisasterIcon(disaster.disaster_type, disaster.status)}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold">{disaster.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {disaster.location_name}, {disaster.province}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <DisasterBadge status={disaster.status} />
                        <SeverityBadge severity={disaster.severity} />
                      </div>
                      <p className="text-sm mt-2">
                        {disaster.affected_people.toLocaleString('id-ID')} jiwa terdampak
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          )}

          {showCenters && (
            <MarkerClusterGroup chunkedLoading>
              {mockEvacuationCenters.map((center) => (
                <Marker
                  key={center.id}
                  position={[center.latitude, center.longitude]}
                  icon={createCenterIcon(center.type, center.status)}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold">{center.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {center.location_name}, {center.province}
                      </p>
                      <p className="text-sm mt-2">
                        Kapasitas: {center.current_occupancy}/{center.capacity}
                      </p>
                      <p className="text-sm">Kontak: {center.contact_phone}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          )}
        </MapContainer>

        <div className="absolute top-4 left-4 z-[1000] bg-card border border-border rounded-xl shadow-lg p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Layer</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(tileLayers).map(([key, layer]) => (
              <button
                key={key}
                onClick={() => setActiveLayer(key)}
                className={`p-2 rounded-lg transition-colors ${
                  activeLayer === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-accent'
                }`}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                <layer.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-[1000] bg-card border border-border rounded-xl shadow-lg p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showDisasters}
                onChange={(e) => setShowDisasters(e.target.checked)}
                className="rounded"
              />
              Marker Bencana
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showCenters}
                onChange={(e) => setShowCenters(e.target.checked)}
                className="rounded"
              />
              Marker Posko
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-sm border border-border rounded-lg p-1.5 bg-background"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="siaga">Siaga</option>
              <option value="terkendali">Terdangani</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-[1000] bg-card border border-border rounded-xl shadow-lg p-3">
          <div className="text-xs text-muted-foreground mb-2">Level Zoom: {zoomLevel}</div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => mapRef?.setZoom(zoomLevel + 1)}
              className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapRef?.setZoom(zoomLevel - 1)}
              className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeAlerts.length > 0 && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-destructive/90 text-white rounded-xl shadow-lg p-3 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">Peringatan Aktif</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {activeAlerts.length}
              </span>
            </div>
            <div className="space-y-1 text-xs max-h-24 overflow-y-auto">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-1.5">
                  <span>{disasterTypes[alert.disaster_type]?.emoji}</span>
                  <span className="truncate">{alert.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card border border-border rounded-xl shadow-lg p-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">🌊</div>
              <span>Bencana</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">🏠</div>
              <span>Posko</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px]">3</div>
              <span>Cluster</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
