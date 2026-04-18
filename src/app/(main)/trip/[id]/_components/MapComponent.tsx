import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

const getNumberedIcon = (index: number) => {
  if (typeof window === 'undefined') return undefined as any;
  return L.divIcon({
    className: 'bg-transparent border-none shadow-none',
    html: renderToStaticMarkup(
      <div className="relative flex h-[40px] w-[40px] flex-col items-center justify-center drop-shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary fill-primary/90 h-full w-full"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
        <span className="absolute top-[9px] z-10 text-[13px] leading-none font-bold text-white">
          {index}
        </span>
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 38],
    popupAnchor: [0, -38],
  });
};

export default function MapComponent({
  markers,
  onMapClick,
}: {
  markers: { id: string; lat: number; lng: number }[];
  onMapClick: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={[14.891982723748349, 120.71111480976788]}
      maxBounds={[
        [18.62973890304954, 116.71062250139934],
        [5.5804291216756186, 129.71115579661682],
      ]}
      minZoom={8}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="h-full w-full outline-none"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapClickHandler
        onClick={(lat, lng) => {
          onMapClick(lat, lng);
        }}
      />
      {markers.map((marker, index) => {
        const icon = getNumberedIcon(index + 1);
        return (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={icon}
          >
            <Popup>
              <div className="mb-1 text-center text-base font-bold">
                Stop {index + 1}
              </div>
              <div className="text-muted-foreground bg-muted/50 rounded-lg p-2 text-center font-mono text-xs">
                {marker.lat.toFixed(5)}
                <br />
                {marker.lng.toFixed(5)}
              </div>
            </Popup>
          </Marker>
        );
      })}
      <Polyline
        positions={markers.map((m) => [m.lat, m.lng])}
        color="#3b82f6"
        weight={4}
        opacity={0.7}
        dashArray="10, 10"
      />
    </MapContainer>
  );
}

function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    },
  });
  return null;
}
