import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const difficultyColors = {
  easy: '#22c55e',
  medium: '#f59e0b',
  difficult: '#ef4444',
};

export default function ToursMap({ tours }) {
  const validTours = tours.filter(t => t.coordinates?.lat && t.coordinates?.lng);

  if (validTours.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-100 rounded-2xl text-slate-400 text-sm">
        No tour locations available
      </div>
    );
  }

  const center = [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validTours.map((tour) => (
        <Marker
          key={tour._id}
          position={[tour.coordinates.lat, tour.coordinates.lng]}
        >
          <Popup maxWidth={240}>
            <div style={{ fontFamily: 'sans-serif', padding: '4px' }}>
              {/* Cover image */}
              {tour.coverImage && tour.coverImage !== 'default-tour.jpg' && (
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                />
              )}

              {/* Title */}
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: '#0f172a' }}>
                {tour.title}
              </div>

              {/* Location */}
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                📍 {tour.location}, {tour.country}
              </div>

              {/* Badges row */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                  background: difficultyColors[tour.difficulty] + '22',
                  color: difficultyColors[tour.difficulty],
                  fontWeight: 500,
                }}>
                  {tour.difficulty}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  ⏱ {tour.duration} days
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  ★ {tour.rating?.toFixed(1)}
                </span>
              </div>

              {/* Price + link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                  ${tour.price}
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>/person</span>
                </span>
                
                <Link
                  to={`/tours/${tour._id}`}
                  style={{
                    fontSize: '12px', padding: '4px 12px', borderRadius: '8px',
                    background: '#0284c7', color: 'white', textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  View tour
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}