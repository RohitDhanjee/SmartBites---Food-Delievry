// ============================================================
// Order Tracker Component
// ============================================================
// Visual step-by-step delivery progress indicator.
// Updates in real-time based on WebSocket events.
// ============================================================

import { Package, CreditCard, Bike, ChefHat, CheckCircle2 } from 'lucide-react';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: Package, color: '#3b82f6' },
  { key: 'confirmed', label: 'Payment Confirmed', icon: CreditCard, color: '#8b5cf6' },
  { key: 'preparing', label: 'Preparing Food', icon: ChefHat, color: '#f59e0b' },
  { key: 'picked', label: 'Rider Picked Up', icon: Bike, color: '#ff6b35' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: '#22c55e' },
];

const OrderTracker = ({ status, deliveryInfo }) => {
  const currentIndex = steps.findIndex(s => s.key === status);

  return (
    <div style={styles.tracker}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={step.key} style={styles.step}>
            {/* Connector Line */}
            {index > 0 && (
              <div style={{
                ...styles.line,
                background: isCompleted 
                  ? 'linear-gradient(to right, #ff6b35, #ff8c42)' 
                  : 'var(--border-glass)',
              }}></div>
            )}
            
            {/* Step Circle */}
            <div style={{
              ...styles.circle,
              background: isCompleted 
                ? `linear-gradient(135deg, ${step.color}, ${step.color}dd)`
                : 'var(--bg-glass)',
              border: isCurrent ? `2px solid ${step.color}` : '2px solid transparent',
              boxShadow: isCurrent ? `0 0 20px ${step.color}40` : 'none',
              transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
            }}>
              <Icon size={20} color={isCompleted ? 'white' : '#64748b'} />
            </div>
            
            {/* Step Label */}
            <span style={{
              ...styles.label,
              color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isCurrent ? 600 : 400,
            }}>
              {step.label}
            </span>
          </div>
        );
      })}

      {/* Delivery Info */}
      {deliveryInfo && (
        <div style={styles.deliveryInfo} className="glass-card">
          <div style={styles.riderInfo}>
            <span style={styles.riderEmoji}>🏍️</span>
            <div>
              <p style={styles.riderName}>{deliveryInfo.riderName || 'Finding rider...'}</p>
              {deliveryInfo.riderPhone && (
                <p style={styles.riderPhone}>{deliveryInfo.riderPhone}</p>
              )}
            </div>
          </div>
          {deliveryInfo.estimatedTime !== undefined && (
            <div style={styles.eta}>
              <span style={styles.etaTime}>{deliveryInfo.estimatedTime}</span>
              <span style={styles.etaLabel}>min</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  tracker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
    padding: '24px 0',
    width: '100%',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: '200px',
  },
  line: {
    width: '3px',
    height: '32px',
    borderRadius: '2px',
    marginBottom: '4px',
    transition: 'all 0.5s ease',
  },
  circle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.5s ease',
    marginBottom: '8px',
  },
  label: {
    fontSize: '13px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    marginBottom: '8px',
  },
  deliveryInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    marginTop: '24px',
    width: '100%',
    maxWidth: '320px',
  },
  riderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  riderEmoji: {
    fontSize: '28px',
  },
  riderName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  riderPhone: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  eta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  etaTime: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#ff6b35',
  },
  etaLabel: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
};

export default OrderTracker;
