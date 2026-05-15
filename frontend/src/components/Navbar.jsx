// ============================================================
// Navbar Component
// ============================================================
// Responsive navigation bar with cart badge and user menu.
// ============================================================

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, User, LogOut, UtensilsCrossed, Package, BarChart2, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout, cartCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🍔</span>
          <span style={styles.logoText}>Smart<span style={styles.logoAccent}>Bite</span></span>
        </Link>

        {/* Navigation Links */}
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            <UtensilsCrossed size={16} />
            Restaurants
          </Link>

          <button onClick={toggleTheme} style={styles.themeToggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/orders" style={styles.link}>
                <Package size={16} />
                My Orders
              </Link>
              
              {user?.role === 'admin' && (
                <>
                  <Link to="/admin" style={styles.link}>
                    <UtensilsCrossed size={16} />
                    Admin
                  </Link>
                  <Link to="/admin/analytics" style={styles.link}>
                    <BarChart2 size={16} />
                    Analytics
                  </Link>
                </>
              )}
              
              <Link to="/cart" style={styles.cartLink}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span style={styles.cartBadge}>{cartCount}</span>
                )}
              </Link>

              <div style={{display:'flex', alignItems:'center', gap:4}}>
                <Link to="/profile" style={styles.userMenu}>
                  <User size={16} />
                  <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" style={styles.authBtn}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--bg-primary)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-glass)',
    padding: '0 0',
    opacity: 0.95,
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'var(--bg-glass)',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginRight: '4px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  cartLink: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    background: 'var(--bg-glass)',
    border: '1px solid var(--border-glass)',
    transition: 'all 0.2s',
  },
  cartBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 700,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'var(--bg-glass)',
    border: '1px solid var(--border-glass)',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    marginLeft: '4px',
    textDecoration: 'none',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'all 0.2s',
  },
  authBtn: {
    textDecoration: 'none',
  }
};

export default Navbar;
