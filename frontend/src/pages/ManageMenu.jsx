// ============================================================
// Manage Menu Page
// ============================================================
// Allows admins to add/remove menu items for a restaurant.
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';

const ManageMenu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      const [resInfo, resMenu] = await Promise.all([
        api.get(`/api/restaurants/${restaurantId}`),
        api.get(`/api/restaurants/menu/${restaurantId}`)
      ]);

      setRestaurant(resInfo.data.data);
      setMenuItems(resMenu.data.data);
    } catch (error) {
      toast.error('Failed to load data');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/restaurants/menu/add', {
        ...newItem,
        restaurantId,
        price: Number(newItem.price)
      });

      if (response.data.success) {
        toast.success('Menu item added');
        setMenuItems([...menuItems, response.data.data]);
        setNewItem({ name: '', description: '', price: '', category: 'main', image: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;

    try {
      const response = await api.delete(`/api/restaurants/menu/delete/${id}`);

      if (response.data.success) {
        toast.success('Item deleted');
        setMenuItems(menuItems.filter(item => item._id !== id));
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="loading">Loading menu...</div>;

  return (
    <div className="page animate-fadeIn">
      <div className="container">
        <button onClick={() => navigate('/admin')} className="btn-back">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="header-row">
          <div className="page-header">
            <h1>Manage Menu</h1>
            <p className="subtitle">{restaurant.name}</p>
          </div>
          <button 
            className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : <><Plus size={18} /> Add Item</>}
          </button>
        </div>

        {showAddForm && (
          <div className="glass-card add-item-card animate-slideUp">
            <h3>Add New Menu Item</h3>
            <form onSubmit={handleAddItem} className="menu-form">
              <div className="form-grid">
                <div className="input-group">
                  <label>Item Name</label>
                  <input 
                    className="input-field"
                    type="text" 
                    value={newItem.name} 
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g. Special Beef Burger"
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Price (PKR)</label>
                  <input 
                    className="input-field"
                    type="number" 
                    value={newItem.price} 
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                    placeholder="850"
                    required 
                  />
                </div>
                <div className="input-group full-width">
                  <label>Description</label>
                  <input 
                    className="input-field"
                    type="text" 
                    value={newItem.description} 
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Short description of the dish..."
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select 
                    className="input-field"
                    value={newItem.category} 
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="main">Main Course</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="side">Side Dish</option>
                    <option value="dessert">Dessert</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Image URL</label>
                  <input 
                    className="input-field"
                    type="url" 
                    value={newItem.image} 
                    onChange={e => setNewItem({...newItem, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    required 
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create Menu Item</button>
              </div>
            </form>
          </div>
        )}

        <div className="glass-card table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="restaurant-cell">
                      <img src={item.image} alt={item.name} className="mini-thumb" />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-desc">{item.description}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{item.category}</span></td>
                  <td><span className="item-price">Rs. {item.price}</span></td>
                  <td>
                    <button onClick={() => handleDeleteItem(item._id)} className="btn-icon delete" title="Delete Item">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {menuItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-msg">
                    <div className="empty-state">
                      <div className="emoji">🍽️</div>
                      <h3>No items found</h3>
                      <p>Start by adding some delicious dishes to your menu.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
          margin-bottom: 1rem;
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition-fast);
        }
        .btn-back:hover {
          color: var(--accent-primary);
          transform: translateX(-4px);
        }
        .subtitle {
          color: var(--accent-primary);
          font-weight: 600;
          margin-top: 0.25rem;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
        }
        .add-item-card {
          padding: 2rem;
          margin-bottom: 2.5rem;
        }
        .add-item-card h3 {
          margin-bottom: 1.5rem;
          font-size: 18px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .full-width {
          grid-column: span 2;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
        }
        .table-container {
          padding: 0.5rem;
          overflow: hidden;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th {
          padding: 1.25rem 1rem;
          color: var(--text-secondary);
          font-size: 13px;
          text-transform: uppercase;
          text-align: left;
          border-bottom: 1px solid var(--border-glass);
        }
        .admin-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border-glass);
          vertical-align: middle;
        }
        .item-info {
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .item-desc {
          font-size: 12px;
          color: var(--text-muted);
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-price {
          font-weight: 700;
          color: var(--text-primary);
        }
        .btn-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          cursor: pointer;
        }
        .btn-icon:hover {
          background: var(--bg-card-hover);
          color: var(--danger);
          border-color: var(--danger);
        }
        .empty-msg {
          padding: 4rem 0 !important;
        }
      `}} />
    </div>
  );
};


export default ManageMenu;
