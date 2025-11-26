import { useState, useEffect } from 'react';

let showToastFunction = null;

export const toast = {
  success: (message) => showToastFunction?.(message, 'success'),
  error: (message) => showToastFunction?.(message, 'error')
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToastFunction = (message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 4000);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(({ id, message, type }) => (
        <div
          key={id}
          style={{
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message}
          </div>
        </div>
      ))}
    </div>
  );
}