// ============================================================
// Add/Edit Restaurant Page
// ============================================================
// Form to create new restaurants or update existing ones.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../api/axios';

const AddEditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    rating: 4.0,
    image: '',
    deliveryTime: '30-40 min'
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchRestaurant();
    }
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/api/restaurants/${id}`);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch restaurant details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit 
        ? `/api/restaurants/update/${id}`
        : '/api/restaurants/add';
      
      const method = isEdit ? 'put' : 'post';

      const response = await api[method](url, formData);

      if (response.data.success) {
        toast.success(isEdit ? 'Restaurant updated' : 'Restaurant added');
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page animate-fadeIn">
      <div className="container narrow">
        <button onClick={() => navigate('/admin')} className="btn-back">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="page-header">
          <h1>{isEdit ? 'Edit Restaurant' : 'Add New Restaurant'}</h1>
          <p>Fill in the details below to {isEdit ? 'update' : 'list'} your restaurant on SmartBite.</p>
        </div>
        
        <div className="glass-card form-card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Restaurant Name</label>
              <input 
                className="input-field"
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Pizza Palace"
                required 
              />
            </div>

            <div className="input-group">
              <label>Cuisine Type</label>
              <input 
                className="input-field"
                type="text" 
                name="cuisine" 
                value={formData.cuisine} 
                onChange={handleChange} 
                placeholder="e.g. Italian, Pakistani"
                required 
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <input 
                className="input-field"
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Full address"
                required 
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Initial Rating</label>
                <input 
                  className="input-field"
                  type="number" 
                  name="rating" 
                  step="0.1" 
                  min="0" 
                  max="5"
                  value={formData.rating} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Delivery Time</label>
                <input 
                  className="input-field"
                  type="text" 
                  name="deliveryTime" 
                  value={formData.deliveryTime} 
                  onChange={handleChange} 
                  placeholder="e.g. 20-30 min"
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Image URL</label>
              <input 
                className="input-field"
                type="url" 
                name="image" 
                value={formData.image} 
                onChange={handleChange} 
                placeholder="https://images.unsplash.com/..."
                required 
              />
            </div>

            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
                <div className="preview-label">Live Preview</div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block">
              <Save size={18} /> {isEdit ? 'Update Restaurant' : 'Create Restaurant'}
            </button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .container.narrow {
          max-width: 600px;
        }
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
        .form-card {
          padding: 2.5rem;
          margin-top: 1rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .image-preview {
          position: relative;
          margin: 0.5rem 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 180px;
          border: 1px solid var(--border-glass);
        }
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-label {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
        }
        .btn-block {
          width: 100%;
          margin-top: 1rem;
          height: 52px;
        }
      `}} />
    </div>
  );
};


export default AddEditRestaurant;
