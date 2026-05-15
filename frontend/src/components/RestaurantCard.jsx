// ============================================================
// Restaurant Card Component
// ============================================================

import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} style={{ textDecoration: 'none' }}>
      <div className="glass-card animate-fadeIn" style={styles.card}>
        {/* Image */}
        <div style={styles.imageContainer}>
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400';
            }}
          />
          <div style={styles.imageOverlay}></div>
          {restaurant.isOpen ? (
            <span className="badge badge-success" style={styles.statusBadge}>Open</span>
          ) : (
            <span className="badge badge-danger" style={styles.statusBadge}>Closed</span>
          )}
        </div>

        {/* Info */}
        <div style={styles.info}>
          <h3 style={styles.name}>{restaurant.name}</h3>
          <p style={styles.cuisine}>{restaurant.cuisine}</p>
          
          <div style={styles.meta}>
            <span style={styles.metaItem}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              {restaurant.rating?.toFixed(1) || '4.0'}
            </span>
            <span style={styles.metaItem}>
              <Clock size={14} />
              {restaurant.deliveryTime || '30-45 min'}
            </span>
          </div>
          
          <div style={styles.address}>
            <MapPin size={13} />
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    overflow: 'hidden',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    height: '180px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, rgba(10,10,15,0.8), transparent)',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
  },
  info: {
    padding: '16px 20px 20px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  cuisine: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 500,
  },
  meta: {
    display: 'flex',
    gap: '16px',
    marginBottom: '10px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  address: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
};

export default RestaurantCard;
