import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 380,
        width: '100%',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        let bg = 'rgba(30, 41, 59, 0.95)';
        let border = '1px solid rgba(255, 255, 255, 0.1)';
        let icon = <Info size={18} color="#3b82f6" />;

        if (toast.type === 'success') {
          bg = 'rgba(6, 78, 59, 0.95)';
          border = '1px solid rgba(16, 185, 129, 0.4)';
          icon = <CheckCircle size={18} color="#34d399" />;
        } else if (toast.type === 'error') {
          bg = 'rgba(136, 19, 55, 0.95)';
          border = '1px solid rgba(244, 63, 94, 0.4)';
          icon = <AlertCircle size={18} color="#fca5a5" />;
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: bg,
              border: border,
              backdropFilter: 'blur(10px)',
              padding: '12px 16px',
              borderRadius: 12,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              fontSize: '0.9rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
