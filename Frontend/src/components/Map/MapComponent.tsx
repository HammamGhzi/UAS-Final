import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  nama?: string;
  alamat?: string;
}

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  nama,
  alamat,
}) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={customIcon}>
        <Popup>
          <div className="text-sm">
            <strong>{nama || 'Lokasi'}</strong>
            {alamat && <p>{alamat}</p>}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};