// ============================================================
// Menu Item Card Component
// ============================================================

import { Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MenuItemCard = ({ item, restaurant }) => {
  const { addToCart, cart } = useAuth();
  const inCart = cart.find(i => i._id === item._id);

  return (
    <div className="glass-card animate-fadeIn" style={styles.card}>
      <img 
        src={item.image} 
        alt={item.name}
        style={styles.image}
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300';
        }}
      />
      <div style={styles.info}>
        <div style={styles.header}>
          <h4 style={styles.name}>{item.name}</h4>
          <span className="badge badge-info" style={{ fontSize: '10px' }}>
            {item.category}
          </span>
        </div>
        <p style={styles.description}>{item.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>Rs. {item.price}</span>
          <button
            className={`btn btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => addToCart(item, restaurant)}
            style={styles.addBtn}
          >
            {inCart ? (
              <><Check size={14} /> Added ({inCart.quantity})</>
            ) : (
              <><Plus size={14} /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
  },
  info: {
    padding: '14px 16px 16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '6px',
  },
  name: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  description: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
    lineHeight: 1.4,
    flex: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#ff8c42',
  },
  addBtn: {
    fontSize: '12px',
    padding: '6px 14px',
  }
};

export default MenuItemCard;
