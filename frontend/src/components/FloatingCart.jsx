import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCart = () => {
  const { cartCount, cartTotal } = useAuth();
  const location = useLocation();

  // Don't show on cart page or if cart is empty
  if (cartCount === 0 || location.pathname === '/cart') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        style={styles.wrapper}
      >
        <Link to="/cart" style={styles.container}>
          <div style={styles.left}>
            <div style={styles.iconWrapper}>
              <ShoppingCart size={20} color="white" />
              <motion.span 
                key={cartCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                style={styles.badge}
              >
                {cartCount}
              </motion.span>
            </div>
            <div style={styles.info}>
              <span style={styles.label}>VIEW YOUR CART</span>
              <span style={styles.total}>Rs. {cartTotal.toLocaleString()}</span>
            </div>
          </div>
          <div style={styles.right}>
            <ArrowRight size={20} color="white" />
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 1000,
    width: 'auto',
    minWidth: '320px',
    maxWidth: '400px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
    padding: '12px 20px',
    borderRadius: '16px',
    textDecoration: 'none',
    boxShadow: '0 12px 30px rgba(255, 107, 53, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconWrapper: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.2)',
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: 'white',
    color: '#ff6b35',
    fontSize: '12px',
    fontWeight: '800',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: '0.5px',
  },
  total: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'white',
  },
  right: {
    background: 'rgba(255, 255, 255, 0.2)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default FloatingCart;
