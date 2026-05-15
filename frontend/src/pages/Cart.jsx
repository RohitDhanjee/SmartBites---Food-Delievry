import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, cartRestaurant, cartTotal, updateQuantity, removeFromCart, clearCart, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!address.trim()) { toast.error('Please enter delivery address'); return; }
    setLoading(true);
    try {
      const orderData = {
        restaurantId: cartRestaurant._id,
        restaurantName: cartRestaurant.name,
        items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: cartTotal,
        deliveryAddress: address,
        paymentMethod: 'card'
      };
      const res = await api.post('/api/orders/create', orderData);
      if (res.data.success) {
        toast.success('Order placed successfully! 🎉');
        clearCart();
        navigate(`/track/${res.data.data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (cart.length === 0) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state"><div className="emoji">🛒</div><h3>Your cart is empty</h3><p>Browse restaurants and add items to your cart</p>
          <Link to="/" className="btn btn-primary" style={{marginTop:16}}>Browse Restaurants</Link></div>
      </div></div>
    );
  }

  return (
    <div className="page"><div className="container" style={{maxWidth:700}}>
      <Link to="/" style={{display:'inline-flex',alignItems:'center',gap:8,color:'var(--text-muted)',fontSize:14,marginBottom:20,textDecoration:'none'}}>
        <ArrowLeft size={18} /> Continue Shopping
      </Link>
      <div className="page-header"><h1>Your Cart</h1><p>From {cartRestaurant?.name}</p></div>
      
      <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>
        {cart.map(item => (
          <div key={item._id} className="glass-card" style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:16}}>
            <img src={item.image} alt={item.name} style={{width:60,height:60,borderRadius:10,objectFit:'cover'}}
              onError={e=>{e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';}} />
            <div style={{flex:1}}>
              <h4 style={{fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>{item.name}</h4>
              <p style={{fontSize:14,color:'#ff8c42',fontWeight:600}}>Rs. {item.price}</p>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button onClick={()=>updateQuantity(item._id, item.quantity-1)} className="btn btn-secondary btn-sm" style={{padding:'4px 8px',minWidth:0}}>
                <Minus size={14} />
              </button>
              <span style={{fontSize:16,fontWeight:700,color:'var(--text-primary)',minWidth:24,textAlign:'center'}}>{item.quantity}</span>
              <button onClick={()=>updateQuantity(item._id, item.quantity+1)} className="btn btn-secondary btn-sm" style={{padding:'4px 8px',minWidth:0}}>
                <Plus size={14} />
              </button>
              <button onClick={()=>removeFromCart(item._id)} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',padding:4}}>
                <Trash2 size={16} />
              </button>
            </div>
            <span style={{fontSize:15,fontWeight:700,color:'var(--text-primary)',minWidth:70,textAlign:'right'}}>Rs. {item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{padding:24,marginBottom:16}}>
        <div className="input-group" style={{marginBottom:16}}>
          <label>Delivery Address</label>
          <input type="text" className="input-field" placeholder="Enter your delivery address" value={address} onChange={e=>setAddress(e.target.value)} />
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{color:'var(--text-secondary)'}}>Subtotal</span><span style={{color:'var(--text-primary)'}}>Rs. {cartTotal}</span></div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{color:'var(--text-secondary)'}}>Delivery Fee</span><span style={{color:'#22c55e'}}>FREE</span></div>
        <div style={{height:1,background:'var(--border-glass)',margin:'12px 0'}}></div>
        <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:18,fontWeight:700,color:'var(--text-primary)'}}>Total</span><span style={{fontSize:18,fontWeight:800,color:'#ff6b35'}}>Rs. {cartTotal}</span></div>
      </div>

      <button onClick={handleCheckout} className="btn btn-primary btn-lg" disabled={loading} style={{width:'100%'}}>
        {loading ? <div className="spinner" style={{width:20,height:20,borderWidth:2}}></div> : <><ShoppingBag size={20} /> Place Order — Rs. {cartTotal}</>}
      </button>
    </div></div>
  );
};

export default Cart;
