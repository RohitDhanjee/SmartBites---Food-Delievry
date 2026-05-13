// ============================================================
// Admin Dashboard Page
// ============================================================
// Allows admins to manage the platform's restaurants.
// Features: List, Delete, and links to Add/Edit.
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/restaurants');
      if (response.data.success) {
        setRestaurants(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant and all its menu items?')) return;

    try {
      const token = localStorage.getItem('smartbite_token');
      const response = await axios.delete(`http://localhost:4000/api/restaurants/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Restaurant deleted');
        setRestaurants(restaurants.filter(r => r._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page animate-fadeIn">
      <div className="container">
        <div className="admin-header">
          <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Manage your restaurant network and menu catalog.</p>
          </div>
          <Link to="/admin/restaurant/add" className="btn btn-primary">
            <Plus size={18} /> Add Restaurant
          </Link>
        </div>

        <div className="admin-stats-grid">
          <div className="glass-card stat-card">
            <span className="stat-label">Total Restaurants</span>
            <span className="stat-value">{restaurants.length}</span>
          </div>
          <div className="glass-card stat-card">
            <span className="stat-label">System Status</span>
            <span className="stat-value status-active">Active</span>
          </div>
        </div>

        <div className="glass-card table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Cuisine</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id}>
                  <td>
                    <div className="restaurant-cell">
                      <img src={restaurant.image} alt={restaurant.name} className="mini-thumb" />
                      <div className="res-info">
                        <span className="res-name">{restaurant.name}</span>
                        <span className="res-addr">{restaurant.address}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{restaurant.cuisine}</span></td>
                  <td>
                    <div className="rating-cell">
                      ⭐ <span>{restaurant.rating}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/menu/${restaurant._id}`} className="btn-icon" title="Manage Menu">
                        <ExternalLink size={16} />
                      </Link>
                      <Link to={`/admin/restaurant/edit/${restaurant._id}`} className="btn-icon" title="Edit Info">
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(restaurant._id)} 
                        className="btn-icon delete" 
                        title="Remove Restaurant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .stat-label {
          color: var(--text-secondary);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .status-active {
          color: var(--success);
        }
        .table-container {
          padding: 0.5rem;
          overflow: hidden;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 1.25rem 1rem;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-glass);
        }
        .admin-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border-glass);
          vertical-align: middle;
        }
        .admin-table tr:last-child td {
          border-bottom: none;
        }
        .restaurant-cell {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .mini-thumb {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          object-fit: cover;
          border: 1px solid var(--border-glass);
        }
        .res-info {
          display: flex;
          flex-direction: column;
        }
        .res-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .res-addr {
          font-size: 12px;
          color: var(--text-muted);
        }
        .rating-cell {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }
        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .btn-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .btn-icon:hover {
          background: var(--bg-card-hover);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }
        .btn-icon.delete:hover {
          color: var(--danger);
          border-color: var(--danger);
        }
      `}} />
    </div>
  );
};

export default AdminDashboard;
