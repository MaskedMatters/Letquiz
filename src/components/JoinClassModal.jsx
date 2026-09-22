import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, KeyRound, ArrowRight, ShieldAlert } from 'lucide-react';

export default function JoinClassModal({ initialCode = '', onClose }) {
  const { joinClassWithInviteCode } = useApp();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCode) setCode(initialCode);
  }, [initialCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!code.trim()) {
      setError('Please enter a valid invite code');
      return;
    }

    const success = joinClassWithInviteCode(code.trim());
    if (success) {
      onClose();
    } else {
      setError('Invalid invite code. Please check your code and try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <KeyRound size={20} color="#c084fc" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Join Study Class</h3>
              <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                Enter the secret code provided by your teacher or class admin
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>
              Invite Code:
            </label>
            <input
              type="text"
              required
              autoFocus
              className="input-field"
              placeholder="Enter invite code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{
                fontSize: '1.1rem',
                letterSpacing: '0.1em',
                textAlign: 'center',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            />
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#fca5a5',
                fontSize: '0.85rem',
                background: 'rgba(244, 63, 94, 0.12)',
                padding: '8px 12px',
                borderRadius: 8
              }}
            >
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}
            >
              <span>Unlock Class</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
