const Skeleton = ({ width, height, borderRadius, style }) => {
  return (
    <div 
      className="skeleton" 
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius: borderRadius || 'var(--radius-md)',
        ...style 
      }} 
    />
  );
};

export const RestaurantSkeleton = () => (
  <div className="glass-card" style={{ overflow: 'hidden' }}>
    <Skeleton height="200px" borderRadius="0" />
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <Skeleton width="60%" height="24px" />
        <Skeleton width="40px" height="24px" />
      </div>
      <Skeleton width="40%" height="16px" style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width="80px" height="28px" borderRadius="999px" />
        <Skeleton width="80px" height="28px" borderRadius="999px" />
      </div>
    </div>
  </div>
);

export const MenuSkeleton = () => (
  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <Skeleton height="140px" borderRadius="0" />
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Skeleton width="50%" height="18px" />
        <Skeleton width="30px" height="18px" />
      </div>
      <Skeleton width="90%" height="14px" style={{ marginBottom: '12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="60px" height="20px" />
        <Skeleton width="80px" height="32px" borderRadius="var(--radius-md)" />
      </div>
    </div>
  </div>
);

export const OrderSkeleton = () => (
  <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Skeleton width="48px" height="48px" borderRadius="10px" />
        <div>
          <Skeleton width="120px" height="18px" style={{ marginBottom: '6px' }} />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>
      <Skeleton width="100px" height="32px" borderRadius="999px" />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Skeleton width="150px" height="16px" />
      <Skeleton width="80px" height="16px" />
    </div>
  </div>
);

export default Skeleton;
