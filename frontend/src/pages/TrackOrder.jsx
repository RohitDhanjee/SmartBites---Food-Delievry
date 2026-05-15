import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';
import OrderTracker from '../components/OrderTracker';
import OrderChat from '../components/OrderChat';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:4005`;

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    const socket = io(SOCKET_URL);
    socket.on('connect', () => { setConnected(true); socket.emit('track_order', { orderId }); });
    socket.on('disconnect', () => setConnected(false));
    socket.on('delivery_status', (data) => {
      setDelivery(prev => ({ ...prev, ...data }));
    });
    socket.on('delivery_update', (data) => {
      setDelivery(prev => ({ ...prev, status: data.status, estimatedTime: data.estimatedTime }));
      if (data.rider) setDelivery(prev => ({ ...prev, riderName: data.rider.name, riderPhone: data.rider.phone }));
      if (data.message) setMessages(prev => [...prev, { text: data.message, time: new Date().toLocaleTimeString() }]);
      // Map delivery status to order status
      const statusMap = { assigned: 'confirmed', picking: 'preparing', picked: 'picked', delivering: 'picked', delivered: 'delivered' };
      if (statusMap[data.status]) setOrder(prev => prev ? { ...prev, status: statusMap[data.status] } : prev);
    });
    socket.on('location_update', (data) => {
      setDelivery(prev => ({ ...prev, location: data.location, estimatedTime: data.estimatedTime }));
    });
    return () => socket.disconnect();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${orderId}`);
      setOrder(res.data.data);
      try {
        const delRes = await api.get(`/api/delivery/${orderId}`);
        setDelivery(delRes.data.data);
      } catch (e) { /* delivery may not exist yet */ }
    } catch (error) { console.error('Failed:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading order...</p></div>;
  if (!order) return <div className="empty-state"><div className="emoji">😕</div><h3>Order not found</h3><Link to="/orders" className="btn btn-primary" style={{marginTop:16}}>View Orders</Link></div>;

  return (
    <div className="page"><div className="container" style={{maxWidth:600}}>
      <Link to="/orders" style={{display:'inline-flex',alignItems:'center',gap:8,color:'var(--text-muted)',fontSize:14,marginBottom:20,textDecoration:'none'}}>
        <ArrowLeft size={18} /> Back to Orders
      </Link>
      <div className="glass-card" style={{padding:32,textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:24}}>
          {connected ? <><Wifi size={16} color="#22c55e" /><span style={{fontSize:13,color:'#22c55e',fontWeight:500}}>Live Tracking</span></>
            : <><WifiOff size={16} color="#ef4444" /><span style={{fontSize:13,color:'#ef4444',fontWeight:500}}>Connecting...</span></>}
        </div>
        <h2 style={{fontSize:22,fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Order #{orderId.slice(-6).toUpperCase()}</h2>
        <p style={{fontSize:14,color:'var(--text-secondary)',marginBottom:8}}>{order.restaurantName}</p>
        <p style={{fontSize:20,fontWeight:800,color:'#ff6b35',marginBottom:24}}>Rs. {order.totalAmount}</p>

        <OrderTracker status={order.status} deliveryInfo={delivery} />

        {messages.length > 0 && (
          <div style={{marginTop:24,textAlign:'left'}}>
            <h4 style={{fontSize:14,fontWeight:600,color:'var(--text-secondary)',marginBottom:12,textTransform:'uppercase',letterSpacing:0.5}}>Live Updates</h4>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {messages.map((msg, i) => (
                <div key={i} style={{padding:'10px 14px',background:'var(--bg-glass)',borderRadius:10,borderLeft:'3px solid #ff6b35'}}>
                  <p style={{fontSize:14,color:'var(--text-primary)'}}>{msg.text}</p>
                  <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{msg.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{marginTop:24,padding:16,background:'var(--bg-glass)',borderRadius:12}}>
          <h4 style={{fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:10}}>ORDER ITEMS</h4>
          {order.items?.map((item, i) => (
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border-glass)'}}>
              <span style={{fontSize:14,color:'var(--text-secondary)'}}>{item.name} × {item.quantity}</span>
              <span style={{fontSize:14,color:'var(--text-primary)',fontWeight:600}}>Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
      <OrderChat orderId={orderId} />
    </div></div>
  );
};

export default TrackOrder;
