import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { disasterTypes } from '../../lib/data';
import 'leaflet/dist/leaflet.css';

const JABAR_CENTER = [-6.9, 107.6];
const JABAR_BOUNDS = [[-7.85, 105.1], [-5.9, 109.3]];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createDisasterIcon = (type) => {
  const typeInfo = disasterTypes[type] || { emoji: '⚠️' };
  return L.divIcon({
    html: `<div style="font-size: 24px; text-align: center; line-height: 1;">${typeInfo.emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    className: 'custom-disaster-marker',
  });
};

export default function DashboardMap({ disasters, center = JABAR_CENTER, zoom = 9, height = '300px' }) {
  return (
    <div style={{ height, borderRadius: '0.5rem', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        bounds={JABAR_BOUNDS}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
          {disasters.map((disaster) => (
            <Marker
              key={disaster.id}
              position={[disaster.latitude, disaster.longitude]}
              icon={createDisasterIcon(disaster.disaster_type)}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold">{disaster.title}</h3>
                  <p className="text-sm text-muted-foreground">{disaster.location_name}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
