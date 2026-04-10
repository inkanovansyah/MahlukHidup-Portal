import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Inject radar pulse CSS animation into document head
const radarStyle = `
  @keyframes radarPulse {
    0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.9; }
    70%  { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
  }
  @keyframes radarPulse2 {
    0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.7; }
    70%  { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
  }
  .radar-dot {
    position: relative;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  .radar-dot .core {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 10px; height: 10px;
    border-radius: 50%;
    z-index: 2;
    box-shadow: 0 0 8px 2px currentColor;
  }
  .radar-dot .ring1 {
    position: absolute;
    top: 50%; left: 50%;
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid currentColor;
    animation: radarPulse 2s ease-out infinite;
    animation-delay: 0s;
  }
  .radar-dot .ring2 {
    position: absolute;
    top: 50%; left: 50%;
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid currentColor;
    animation: radarPulse2 2s ease-out infinite;
    animation-delay: 0.6s;
  }
  .radar-dot .ring3 {
    position: absolute;
    top: 50%; left: 50%;
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    animation: radarPulse 2s ease-out infinite;
    animation-delay: 1.2s;
  }
`;

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
    description: string;
    status?: 'safe' | 'warning' | 'danger';
    type?: 'site' | 'drone' | 'alert';
  }>;
  className?: string;
  onMarkerClick?: (marker: any) => void;
}

const getStatusColor = (status?: string) => {
  switch(status) {
    case 'danger':  return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'safe':
    default:        return '#10b981';
  }
};

// Creates a custom DivIcon with radar pulse animation
const createRadarIcon = (color: string) => {
  return L.divIcon({
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `
      <div class="radar-dot" style="color: ${color};">
        <div class="core" style="background: ${color};"></div>
        <div class="ring1"></div>
        <div class="ring2"></div>
        <div class="ring3"></div>
      </div>
    `,
  });
};

// Component to inject style + add clickable radar markers using Leaflet directly
const RadarMarkers: React.FC<{ markers: MapViewProps['markers']; onMarkerClick?: (m: any) => void }> = ({ markers = [], onMarkerClick }) => {
  const map = useMap();

  useEffect(() => {
    // Inject styles once
    if (!document.getElementById('radar-pulse-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'radar-pulse-style';
      styleEl.textContent = radarStyle;
      document.head.appendChild(styleEl);
    }

    // Add markers
    const leafletMarkers: L.Marker[] = [];
    markers.forEach((marker) => {
      const color = getStatusColor(marker.status);
      const icon = createRadarIcon(color);
      const m = L.marker(marker.position as L.LatLngExpression, { icon });
      m.on('click', () => { if (onMarkerClick) onMarkerClick(marker); });
      m.addTo(map);
      leafletMarkers.push(m);
    });

    return () => {
      leafletMarkers.forEach((m) => m.remove());
    };
  }, [map, markers, onMarkerClick]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  center = [-6.9147, 107.6098],
  zoom = 10, 
  markers = [],
  className = "h-full w-full",
  onMarkerClick
}) => {
  return (
    <div className={`${className} bg-[#0b1730] relative`}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Colored zone circles */}
        {markers.map((marker, idx) => (
          <Circle
            key={idx}
            center={marker.position}
            radius={2200}
            pathOptions={{
              color: getStatusColor(marker.status),
              fillColor: getStatusColor(marker.status),
              fillOpacity: marker.status === 'danger' ? 0.25 : 0.12,
              weight: 1.5,
              dashArray: marker.status === 'danger' ? '6 4' : undefined,
            }}
          />
        ))}

        {/* Animated radar dot markers */}
        <RadarMarkers markers={markers} onMarkerClick={onMarkerClick} />
      </MapContainer>
    </div>
  );
};

export default MapView;
