import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { sanggarApi } from '../../services/api';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type SanggarPoint = {
  id: number;
  name: string;
  address: string;
  latitude: string | number;
  longitude: string | number;
  region?: { name: string };
};

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Komponen untuk fit bounds ke semua marker
const FitBounds = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
};

export const SanggarMap = () => {
  const { data: sanggars = [], isLoading } = useQuery({
    queryKey: ['sanggars-map'],
    queryFn: async () => {
      const res = await sanggarApi.getAll();
      return res.data.data as SanggarPoint[];
    },
  });

  const validSanggars = sanggars.filter(
    (s) => s.latitude && s.longitude &&
      !isNaN(Number(s.latitude)) && !isNaN(Number(s.longitude))
  );

  const points: [number, number][] = validSanggars.map((s) => [
    Number(s.latitude),
    Number(s.longitude),
  ]);

  // Pusat default: Kota Tegal
  const defaultCenter: [number, number] = [-6.8694, 109.1402];

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded-2xl">
        Memuat peta...
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.length > 0 && <FitBounds points={points} />}
      {validSanggars.map((s) => (
        <Marker
          key={s.id}
          position={[Number(s.latitude), Number(s.longitude)]}
          icon={customIcon}
        >
          <Popup>
            <div className="text-sm min-w-[140px]">
              <strong className="block mb-0.5">{s.name}</strong>
              {s.region?.name && (
                <span className="text-xs text-gray-500 block mb-0.5">{s.region.name}</span>
              )}
              <span className="text-xs text-gray-600">{s.address}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
