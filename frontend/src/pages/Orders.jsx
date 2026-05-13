import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Package, Eye, Clock, Star } from 'lucide-react';

const statusColors = {
  placed: '#3b82f6', confirmed: '#8b5cf6', preparing: '#f59e0b',
  ready: '#06b6d4', picked: '#ff6b35', delivered: '#22c55e', cancelled: '#ef4444'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { if (user?._id) fetchOrders(); }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/api/orders/user/${user._id}`);
      setOrders(res.data.data || []);
    } catch (error) { console.error('Failed:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading orders...</p></div>;

  return (
    <div className="page"><div className="container" style={{maxWidth:800}}>
      <div className="page-header"><h1>My Orders</h1><p>{orders.length} orders</p></div>
      
      {orders.length === 0 ? (
        <div className="empty-state"><div className="emoji">📦</div><h3>No orders yet</h3><p>Place your first order!</p>
          <Link to="/" className="btn btn-primary" style={{marginTop:16}}>Browse Restaurants</Link></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {orders.map((order, i) => (
            <div key={order._id} className="glass-card animate-fadeIn" style={{padding:'20px 24px',animationDelay:`${i*0.05}s`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div>
                  <h3 style={{fontSize:17,fontWeight:700,color:'#f1f5f9',marginBottom:4}}>{order.restaurantName}</h3>
                  <p style={{fontSize:12,color:'#64748b',display:'flex',alignItems:'center',gap:4}}>
                    <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                  </p>
                </div>
                <span style={{padding:'4px 12px',borderRadius:999,fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,
                  background:`${statusColors[order.status]}20`,color:statusColors[order.status]}}>
                  {order.status}
                </span>
              </div>
              <div style={{fontSize:13,color:'#94a3b8',marginBottom:12}}>
                {order.items?.map(i => `${i.name} x${i.quantity}`).join(' • ')}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:16,fontWeight:700,color:'#ff6b35'}}>Rs. {order.totalAmount}</span>
                  <div style={{display:'flex',gap:8}}>
                    {order.status === 'delivered' && (
                      <Link to={`/review/${order._id}`} className="btn btn-secondary btn-sm" style={{borderColor: '#22c55e', color: '#22c55e'}}>
                        <Star size={14} /> Leave Review
                      </Link>
                    )}
                    {!['delivered','cancelled'].includes(order.status) && (
                      <Link to={`/track/${order._id}`} className="btn btn-primary btn-sm"><Eye size={14} /> Track</Link>
                    )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div></div>
  );
};

export default Orders;
