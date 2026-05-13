import { useState, useEffect } from 'react';
import api from '../api/axios';
import { TrendingUp, Users, ShoppingBag, CreditCard, Award, ArrowUpRight, BarChart2 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/analytics/dashboard');
      setData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Aggregating platform data...</p></div>;
  if (!data) return <div className="empty-state"><h3>Failed to load analytics</h3></div>;

  const { orders, payments, restaurants } = data;

  return (
    <div className="page animate-fadeIn">
      <div className="container">
        <div className="page-header">
          <h1>Platform Analytics</h1>
          <p>Real-time insights across all microservices</p>
        </div>

        {/* KPI Cards */}
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e'}}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Revenue</span>
              <h3 className="stat-value">Rs. {orders?.totalRevenue?.toLocaleString()}</h3>
              <span className="stat-trend success"><ArrowUpRight size={14} /> 12% vs last month</span>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
              <ShoppingBag size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Orders</span>
              <h3 className="stat-value">{orders?.totalOrders}</h3>
              <span className="stat-trend info"><ArrowUpRight size={14} /> 5 new today</span>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'}}>
              <Award size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Restaurants</span>
              <h3 className="stat-value">{restaurants?.count}</h3>
              <span className="stat-trend warning">Active Listing</span>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6'}}>
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Payments</span>
              <h3 className="stat-value">{payments?.totalPayments}</h3>
              <span className="stat-trend secondary">98% Success</span>
            </div>
          </div>
        </div>

        <div className="charts-container">
          {/* Daily Trends Chart - Pure CSS */}
          <div className="glass-card chart-card">
            <h3 className="chart-title"><BarChart2 size={18} /> Order Trends (Last 7 Days)</h3>
            <div className="bar-chart">
              {orders?.dailyTrends?.map((day, i) => {
                const maxOrders = Math.max(...orders.dailyTrends.map(d => d.orders)) || 1;
                const height = (day.orders / maxOrders) * 100;
                return (
                  <div key={day._id} className="bar-group">
                    <div className="bar-wrapper">
                      <div className="bar" style={{height: `${height}%`, animationDelay: `${i * 0.1}s`}}>
                        <span className="bar-tooltip">{day.orders} orders</span>
                      </div>
                    </div>
                    <span className="bar-label">{day._id.split('-').slice(1).join('/')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="glass-card chart-card">
            <h3 className="chart-title"><CreditCard size={18} /> Payment Methods</h3>
            <div className="methods-list">
              {payments?.methodBreakdown?.map(method => (
                <div key={method._id} className="method-item">
                  <div className="method-info">
                    <span className="method-name">{method._id.toUpperCase()}</span>
                    <span className="method-count">{method.count}</span>
                  </div>
                  <div className="progress-bg">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${(method.count / payments.totalPayments) * 100}%`,
                        background: method._id === 'card' ? 'var(--accent-primary)' : '#8b5cf6'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-label {
          display: block;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .stat-trend {
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .stat-trend.success { color: #22c55e; }
        .stat-trend.info { color: #3b82f6; }
        .stat-trend.warning { color: #f59e0b; }
        
        .charts-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        @media (max-width: 992px) {
          .charts-container { grid-template-columns: 1fr; }
        }
        .chart-card { padding: 24px; }
        .chart-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        /* Pure CSS Bar Chart */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 240px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          height: 100%;
          justify-content: flex-end;
        }
        .bar-wrapper {
          width: 36px;
          height: 180px; /* Fixed height for the container */
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          position: relative;
        }
        .bar {
          width: 100%;
          background: var(--accent-gradient);
          border-radius: 6px;
          position: relative;
          min-height: 4px; /* Ensure even small values are visible */
          animation: growUp 1s ease-out forwards;
          transform-origin: bottom;
        }
        .bar:hover { filter: brightness(1.2); }
        .bar-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #1e293b;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          white-space: nowrap;
          opacity: 0;
          transition: 0.2s;
        }
        .bar:hover .bar-tooltip { opacity: 1; top: -35px; }
        .bar-label { font-size: 11px; color: var(--text-secondary); }
        
        @keyframes growUp {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        .methods-list { display: flex; flex-direction: column; gap: 20px; }
        .method-info { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .method-name { font-size: 12px; font-weight: 700; color: var(--text-secondary); }
        .method-count { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .progress-bg { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 1.5s ease-in-out; }
      `}} />
    </div>
  );
};

export default Analytics;
