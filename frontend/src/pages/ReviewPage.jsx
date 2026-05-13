import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Star, Send, ArrowLeft } from 'lucide-react';

const ReviewPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (error) {
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error('Please add a comment');
    
    setSubmitting(true);
    try {
      await api.post('/api/reviews/add', {
        orderId,
        restaurantId: order.restaurantId,
        rating,
        comment
      });
      toast.success('Review submitted! Thank you.');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Verifying order...</p></div>;

  return (
    <div className="page animate-fadeIn">
      <div className="container narrow" style={{maxWidth: 600}}>
        <button onClick={() => navigate('/orders')} className="btn-back">
          <ArrowLeft size={18} /> Back to Orders
        </button>

        <div className="page-header">
          <h1>How was your meal?</h1>
          <p>Rate your experience with <strong>{order.restaurantName}</strong></p>
        </div>

        <div className="glass-card" style={{padding: '32px'}}>
          <form onSubmit={handleSubmit}>
            <div style={{textAlign: 'center', marginBottom: '32px'}}>
              <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px'}}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      transform: (hover || rating) >= star ? 'scale(1.2)' : 'scale(1)'
                    }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star 
                      size={40} 
                      fill={(hover || rating) >= star ? '#f59e0b' : 'none'} 
                      color={(hover || rating) >= star ? '#f59e0b' : '#475569'} 
                    />
                  </button>
                ))}
              </div>
              <p style={{fontSize: '18px', fontWeight: 600, color: '#f59e0b'}}>
                {['Poor', 'Fair', 'Good', 'Very Good', 'Amazing'][rating - 1]}
              </p>
            </div>

            <div className="input-group">
              <label>Your Feedback</label>
              <textarea
                className="input-field"
                style={{minHeight: '120px', resize: 'vertical'}}
                placeholder="What did you like or dislike about the food and service?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              style={{marginTop: '24px', height: '54px'}}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : <><Send size={18} /> Submit Review</>}
            </button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .btn-back {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition-fast);
        }
        .btn-back:hover {
          color: var(--accent-primary);
          transform: translateX(-4px);
        }
        .btn-block {
          width: 100%;
        }
      `}} />
    </div>
  );
};

export default ReviewPage;
