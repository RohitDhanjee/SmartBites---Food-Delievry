// ============================================================
// Home Page — Browse Restaurants
// ============================================================

import { useState, useEffect } from 'react';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Flame, TrendingUp } from 'lucide-react';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/api/restaurants');
      setRestaurants(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <div style={styles.hero} className="animate-slideUp">
          <div style={styles.heroTag}>
            <Flame size={14} color="#ff6b35" />
            <span>AI-Powered Food Delivery</span>
          </div>
          <h1 style={styles.heroTitle}>
            Discover <span style={styles.heroAccent}>Delicious</span> Food
            <br />Near You
          </h1>
          <p style={styles.heroSubtitle}>
            Order from the best restaurants with real-time tracking and lightning-fast delivery
          </p>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
              id="search-restaurants"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div style={styles.stats} className="animate-fadeIn">
          <div style={styles.stat}>
            <span style={styles.statNumber}>{restaurants.length}</span>
            <span style={styles.statLabel}>Restaurants</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>30+</span>
            <span style={styles.statLabel}>Menu Items</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.stat}>
            <TrendingUp size={16} color="#22c55e" />
            <span style={styles.statLabel}>Real-time Tracking</span>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🍽️ Popular Restaurants</h2>
          <span style={styles.count}>{filtered.length} found</span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading restaurants...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid-restaurants">
            {filtered.map((restaurant, index) => (
              <div key={restaurant._id} style={{ animationDelay: `${index * 0.1}s` }}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="emoji">🔍</div>
            <h3>No restaurants found</h3>
            <p>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  hero: {
    textAlign: 'center',
    padding: '48px 0 40px',
  },
  heroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: 'rgba(255, 107, 53, 0.1)',
    border: '1px solid rgba(255, 107, 53, 0.2)',
    borderRadius: '999px',
    fontSize: '13px',
    color: '#ff8c42',
    fontWeight: 500,
    marginBottom: '20px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: '16px',
    color: '#f1f5f9',
    letterSpacing: '-1px',
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #ff6b35, #ff8c42, #ffb347)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '17px',
    color: '#94a3b8',
    maxWidth: '500px',
    margin: '0 auto 32px',
    lineHeight: 1.6,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    transition: 'all 0.3s',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#f1f5f9',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    padding: '20px',
    margin: '0 0 40px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#ff6b35',
  },
  statLabel: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: 500,
  },
  statDivider: {
    width: '1px',
    height: '24px',
    background: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  count: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 500,
  },
};

export default Home;
