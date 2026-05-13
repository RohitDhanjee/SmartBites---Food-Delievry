import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import MenuItemCard from '../components/MenuItemCard';
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { cartCount } = useAuth();

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      // Fetch restaurant and menu first (Crucial)
      const [restRes, menuRes] = await Promise.all([
        api.get(`/api/restaurants/${id}`),
        api.get(`/api/restaurants/menu/${id}`)
      ]);
      setRestaurant(restRes.data.data);
      setMenuItems(menuRes.data.data || []);

      // Fetch reviews separately (Optional)
      try {
        const reviewRes = await api.get(`/api/reviews/restaurant/${id}`);
        setReviews(reviewRes.data.data || []);
      } catch (revErr) {
        console.warn('Review Service not responding:', revErr.message);
      }
    } catch (error) { 
      console.error('Core Data Failed:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  const categories = ['all', ...new Set(menuItems.map(i => i.category))];
  const filteredItems = activeCategory === 'all' ? menuItems : menuItems.filter(i => i.category === activeCategory);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading menu...</p></div>;
  if (!restaurant) return <div className="empty-state"><div className="emoji">😕</div><h3>Restaurant not found</h3><Link to="/" className="btn btn-primary" style={{marginTop:16}}>Go Home</Link></div>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/" style={{display:'inline-flex',alignItems:'center',gap:8,color:'#94a3b8',fontSize:14,marginBottom:20,textDecoration:'none'}}>
          <ArrowLeft size={18} /> Back to Restaurants
        </Link>
        <div style={{borderRadius:16,overflow:'hidden',marginBottom:32,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}} className="animate-slideUp">
          <div style={{position:'relative',height:220}}>
            <img src={restaurant.image} alt={restaurant.name} style={{width:'100%',height:'100%',objectFit:'cover'}}
              onError={e=>{e.target.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';}} />
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:'70%',background:'linear-gradient(to top, rgba(10,10,15,0.95), transparent)'}}></div>
          </div>
          <div style={{padding:'20px 24px 24px',marginTop:-60,position:'relative',zIndex:1}}>
            <h1 style={{fontSize:28,fontWeight:800,color:'#f1f5f9',marginBottom:4}}>{restaurant.name}</h1>
            <p style={{fontSize:14,color:'#ff8c42',fontWeight:500,textTransform:'uppercase',letterSpacing:1,marginBottom:12}}>{restaurant.cuisine}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:20}}>
              <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'#cbd5e1'}}><Star size={16} fill="#f59e0b" color="#f59e0b" />{restaurant.rating?.toFixed(1)}</span>
              <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'#cbd5e1'}}><Clock size={16} />{restaurant.deliveryTime}</span>
              <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'#cbd5e1'}}><MapPin size={16} />{restaurant.address}</span>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:24,overflowX:'auto',paddingBottom:8}}>
          {categories.map(cat => (
            <button key={cat} onClick={()=>setActiveCategory(cat)} style={{
              padding:'8px 18px',borderRadius:999,fontSize:13,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap',fontFamily:'Inter,sans-serif',transition:'all 0.2s',
              ...(activeCategory===cat ? {background:'linear-gradient(135deg,#ff6b35,#ff8c42)',color:'white',border:'1px solid transparent'} : {border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'#94a3b8'})
            }}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</button>
          ))}
        </div>
        <div className="grid-menu">{filteredItems.map(item => <MenuItemCard key={item._id} item={item} restaurant={restaurant} />)}</div>
        {filteredItems.length===0 && <div className="empty-state"><div className="emoji">🍽️</div><h3>No items in this category</h3></div>}

        {/* Reviews Section */}
        <div style={{marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40}}>
          <h2 style={{fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12}}>
            ⭐ Customer Reviews <span style={{fontSize: 14, color: '#64748b', fontWeight: 500}}>({reviews.length})</span>
          </h2>
          
          {reviews.length === 0 ? (
            <div style={{padding: '40px 0', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: 12}}>
              No reviews yet for this restaurant.
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              {reviews.map(review => (
                <div key={review._id} className="glass-card animate-fadeIn" style={{padding: 20}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <div style={{width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white'}}>
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{fontWeight: 600, color: '#f1f5f9'}}>{review.userName}</span>
                    </div>
                    <div style={{display: 'flex', gap: 2}}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? '#f59e0b' : 'none'} color={i < review.rating ? '#f59e0b' : '#475569'} />
                      ))}
                    </div>
                  </div>
                  <p style={{fontSize: 14, color: '#94a3b8', lineHeight: 1.5}}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartCount > 0 && <Link to="/cart" className="btn btn-primary" style={{position:'fixed',bottom:24,right:24,zIndex:50,padding:'14px 28px',fontSize:15,borderRadius:999,textDecoration:'none',boxShadow:'0 8px 30px rgba(255,107,53,0.4)'}}><ShoppingCart size={20} />View Cart ({cartCount})</Link>}
      </div>
    </div>
  );
};

export default RestaurantMenu;
