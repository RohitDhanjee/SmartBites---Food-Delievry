import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Phone, MapPin, Save, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/users/profile');
      setProfile(res.data.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/users/profile', {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    
    try {
      await api.delete('/api/users/profile');
      toast.success('Account deleted');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading profile...</p></div>;

  return (
    <div className="page animate-fadeIn">
      <div className="container" style={{maxWidth: 800}}>
        <div className="page-header">
          <h1>User Profile</h1>
          <p>Manage your account settings and personal details</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32}}>
          {/* Sidebar Info */}
          <div className="glass-card" style={{padding: 24, textAlign: 'center', height: 'fit-content'}}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', background: 'var(--accent-gradient)',
              margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <User size={48} color="white" />
            </div>
            <h2 style={{fontSize: 20, marginBottom: 4}}>{profile.name}</h2>
            <p style={{fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24}}>{profile.email}</p>
            
            <div className="badge badge-info" style={{marginBottom: 10}}>
              <ShieldCheck size={14} /> {profile.role?.toUpperCase() || 'USER'}
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: 12,
              border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: 20
            }}>
              <p style={{fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4}}>BitePoints Earned</p>
              <h3 style={{color: 'var(--success)', fontSize: 24, fontWeight: 800}}>{profile.loyaltyPoints || 0}</h3>
            </div>

            <div style={{borderTop: '1px solid var(--border-glass)', paddingTop: 24}}>
              <button 
                onClick={handleDeleteAccount}
                className="btn btn-secondary" 
                style={{width: '100%', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)'}}
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>

          {/* Edit Form */}
          <div className="glass-card" style={{padding: 32}}>
            <form onSubmit={handleUpdate} style={{display: 'flex', flexDirection: 'column', gap: 24}}>
              <div className="input-group">
                <label><User size={14} style={{marginBottom: -2}} /> Full Name</label>
                <input 
                  className="input-field"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  required
                />
              </div>

              <div className="input-group">
                <label><Mail size={14} style={{marginBottom: -2}} /> Email Address (Cannot change)</label>
                <input 
                  className="input-field"
                  value={profile.email}
                  disabled
                  style={{opacity: 0.6, cursor: 'not-allowed'}}
                />
              </div>

              <div className="input-group">
                <label><Phone size={14} style={{marginBottom: -2}} /> Phone Number</label>
                <input 
                  className="input-field"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="input-group">
                <label><MapPin size={14} style={{marginBottom: -2}} /> Delivery Address</label>
                <textarea 
                  className="input-field"
                  rows={4}
                  value={profile.address || ''}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  placeholder="Enter your full delivery address"
                  style={{resize: 'none'}}
                />
              </div>

              <div style={{
                padding: 16, background: 'rgba(245, 158, 11, 0.05)', borderRadius: 12,
                border: '1px solid rgba(245, 158, 11, 0.1)', display: 'flex', gap: 12, alignItems: 'flex-start'
              }}>
                <AlertCircle size={20} color="var(--warning)" style={{marginTop: 2}} />
                <p style={{fontSize: 13, color: 'var(--text-secondary)'}}>
                  Ensure your address and phone number are correct to avoid delivery delays.
                </p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
