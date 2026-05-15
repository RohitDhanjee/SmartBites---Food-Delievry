// ============================================================
// Register Page
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form.name, form.email, form.password, form.phone, form.address);
      toast.success('Account created! Welcome to SmartBite 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={styles.page}>
      <div style={styles.card} className="glass-card animate-slideUp">
        <div style={styles.header}>
          <span style={{ fontSize: '40px' }}>🚀</span>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join SmartBite and start ordering</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="input-group">
            <label htmlFor="reg-name"><User size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Full Name</label>
            <input id="reg-name" name="name" type="text" className="input-field" placeholder="John Doe"
              value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="reg-email"><Mail size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Email</label>
            <input id="reg-email" name="email" type="email" className="input-field" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="reg-password"><Lock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Password</label>
            <input id="reg-password" name="password" type="password" className="input-field" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <div style={styles.row}>
            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="reg-phone"><Phone size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Phone</label>
              <input id="reg-phone" name="phone" type="text" className="input-field" placeholder="0300-1234567"
                value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="reg-address"><MapPin size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Delivery Address</label>
            <input id="reg-address" name="address" type="text" className="input-field" placeholder="123 Main St, City"
              value={form.address} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}>
            {loading ? (
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
            ) : (
              <><UserPlus size={18} /> Create Account</>
            )}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 72px)',
    padding: '20px 0',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '36px 40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginTop: '12px',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  link: {
    color: '#ff6b35',
    fontWeight: 600,
  },
};

export default Register;
