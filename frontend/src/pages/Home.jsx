// ============================================================
// Home Page — Browse Restaurants
// ============================================================

import { useState, useEffect } from 'react';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Flame, TrendingUp } from 'lucide-react';

import { motion } from 'framer-motion';
import { RestaurantSkeleton } from '../components/Skeleton';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAll, resRec] = await Promise.all([
        api.get('/api/restaurants'),
        api.get('/api/restaurants/recommendations')
      ]);
      setRestaurants(resAll.data.data || []);
      setRecommended(resRec.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter(r => {
    const q = search.toLowerCase();
    if (!q) return true;
    
    const name = r.name.toLowerCase();
    const cuisine = r.cuisine.toLowerCase();
    
    // Exact or partial match
    if (name.includes(q) || cuisine.includes(q)) return true;

    // Fuzzy match: checks if all characters of query appear in target in sequence
    // Example: "brgr" will match "Burger"
    const fuzzy = (target, query) => {
      let i = 0, j = 0;
      while (i < target.length && j < query.length) {
        if (target[i] === query[j]) j++;
        i++;
      }
      return j === query.length;
    };

    return fuzzy(name, q) || fuzzy(cuisine, q);
  });

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.hero}
        >
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
        </motion.div>

        {/* AI Recommendations Section */}
        {!loading && recommended.length > 0 && !search && (
          <div style={{ marginBottom: '48px' }}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>✨ Recommended by AI</h2>
              <span style={{ fontSize: '12px', color: '#ff8c42', fontWeight: 600 }}>BASED ON YOUR PREFERENCES</span>
            </div>
            <div className="grid-restaurants">
              {recommended.map((restaurant, index) => (
                <motion.div 
                  key={`rec-${restaurant._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ position: 'relative' }}
                >
                  <div style={styles.aiBadge}>
                    <TrendingUp size={12} /> {restaurant.aiMatchScore}% Match
                  </div>
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.stats}
        >
          <div style={styles.stat}>
            <span style={styles.statNumber}>{loading ? '...' : restaurants.length}</span>
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
        </motion.div>

        {/* Restaurant Grid */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🍽️ All Restaurants</h2>
          {!loading && <span style={styles.count}>{filtered.length} found</span>}
        </div>

        {loading ? (
          <div className="grid-restaurants">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RestaurantSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid-restaurants">
            {filtered.map((restaurant, index) => (
              <motion.div 
                key={restaurant._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
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
    color: 'var(--text-primary)',
    letterSpacing: '-1px',
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #ff6b35, #ff8c42, #ffb347)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '17px',
    color: 'var(--text-secondary)',
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
    background: 'var(--bg-glass)',
    border: '1px solid var(--border-glass)',
    borderRadius: '14px',
    transition: 'all 0.3s',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
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
    background: 'var(--bg-card)',
    borderRadius: '14px',
    border: '1px solid var(--border-glass)',
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
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  statDivider: {
    width: '1px',
    height: '24px',
    background: 'var(--border-glass)',
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
    color: 'var(--text-primary)',
  },
  count: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  aiBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 10,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(4px)',
    color: '#ff8c42',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid rgba(255, 140, 66, 0.3)',
  }
};

export default Home;
