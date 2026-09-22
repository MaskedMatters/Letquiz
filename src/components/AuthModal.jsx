import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { loginWithEmail, registerWithEmail, loginWithProvider, addToast } = useApp();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Password Strength Calculation
  const getPasswordMetrics = (pass) => {
    const hasMinLen = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumSymbol = /[0-9!@#$%^&*()]/.test(pass);

    let score = 0;
    if (hasMinLen) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumSymbol) score++;

    return { hasMinLen, hasUpper, hasLower, hasNumSymbol, score };
  };

  const metrics = getPasswordMetrics(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'register') {
      if (metrics.score < 3) {
        addToast('Please create a stronger password before continuing.', 'error');
        setLoading(false);
        return;
      }
      const res = await registerWithEmail(email, password, name);
      if (res.success) {
        setVerificationSent(true);
      }
    } else {
      await loginWithEmail(email, password);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {mode === 'login' ? 'Sign In to Letquiz' : 'Create Letquiz Account'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {verificationSent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShieldCheck size={28} color="#16a34a" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Account Created!</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              We sent a verification confirmation link to <strong>{email}</strong>. Please check your inbox to activate your account.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Social OAuth Providers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => loginWithProvider('google')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => loginWithProvider('github')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>OR WITH EMAIL</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Password Strength Indicator for Register */}
              {mode === 'register' && password.length > 0 && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Password Strength:</span>
                    <span style={{ fontWeight: 700, color: metrics.score >= 3 ? '#16a34a' : '#d97706' }}>
                      {metrics.score <= 1 ? 'Weak' : metrics.score === 2 ? 'Medium' : 'Strong'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: 4, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(metrics.score / 4) * 100}%`,
                        background: metrics.score >= 3 ? '#16a34a' : metrics.score === 2 ? '#d97706' : '#dc2626',
                        transition: 'width 0.2s'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.74rem', color: '#64748b' }}>
                    <div style={{ color: metrics.hasMinLen ? '#16a34a' : '#94a3b8' }}>
                      {metrics.hasMinLen ? '✓' : '•'} At least 8 characters
                    </div>
                    <div style={{ color: metrics.hasUpper ? '#16a34a' : '#94a3b8' }}>
                      {metrics.hasUpper ? '✓' : '•'} Uppercase letter
                    </div>
                    <div style={{ color: metrics.hasLower ? '#16a34a' : '#94a3b8' }}>
                      {metrics.hasLower ? '✓' : '•'} Lowercase letter
                    </div>
                    <div style={{ color: metrics.hasNumSymbol ? '#16a34a' : '#94a3b8' }}>
                      {metrics.hasNumSymbol ? '✓' : '•'} Number or symbol
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: '#64748b' }}>
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('register')}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
