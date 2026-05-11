import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { disasterTypes, centerTypes } from '../../lib/data';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NearbyLocations({ disasters, centers, limit = 5 }) {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearbyItems, setNearbyItems] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLoading(false);
        },
        () => {
          setUserLocation({ lat: -6.9025, lon: 107.6186 });
          setLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: -6.9025, lon: 107.6186 });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const items = [
      ...disasters.map((d) => ({ type: 'disaster', data: d })),
      ...centers.map((c) => ({ type: 'center', data: c })),
    ];

    const withDistance = items.map((item) => ({
      ...item,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lon,
        item.data.latitude,
        item.data.longitude
      ),
    }));

    withDistance.sort((a, b) => a.distance - b.distance);
    setNearbyItems(withDistance.slice(0, limit));
  }, [userLocation, disasters, centers, limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nearbyItems.map((item, index) => {
        const isDisaster = item.type === 'disaster';
        const data = item.data;
        const typeInfo = isDisaster
          ? disasterTypes[data.disaster_type]
          : centerTypes[data.type];

        return (
          <div
            key={`${item.type}-${data.id}`}
            className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-2xl">{typeInfo?.emoji || '📍'}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{data.name || data.title}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{data.location_name}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Navigation className="w-3 h-3" />
              <span>{item.distance.toFixed(1)} km</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
