import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, Share2, EyeOff, Globe } from 'lucide-react';

export default function ShareModal({ type, item, onClose }) {
  const { addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const origin = window.location.origin;
  const ownerId = item.authorId || item.ownerId || 'public';
  const shareUrl = type === 'folder'
    ? `${origin}/folders/${ownerId}/${item.id}`
    : `${origin}/sets/${ownerId}/${item.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
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
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Share2 size={20} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Share {type === 'folder' ? 'Folder' : 'Flashcard Set'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {item.title}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Callout */}
        <div
          style={{
            background: item.visibility === 'unlisted' ? '#fffbeb' : '#f0fdf4',
            border: item.visibility === 'unlisted' ? '1px solid #fde68a' : '1px solid #bbf7d0',
            borderRadius: 12,
            padding: 14,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12
          }}
        >
          {item.visibility === 'unlisted' ? (
            <EyeOff size={20} color="#d97706" style={{ marginTop: 2 }} />
          ) : (
            <Globe size={20} color="#16a34a" style={{ marginTop: 2 }} />
          )}

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>
              {item.visibility === 'unlisted' ? 'Unlisted Share Link' : 'Public Access'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
              {item.visibility === 'unlisted'
                ? 'Anyone with this exact URL link or belonging to a class holding this folder can view this item.'
                : 'Anyone can find and study this set on your profile and search result hubs.'}
            </div>
          </div>
        </div>

        {/* Share Link Input */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>
            Permanent Link URL:
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="input-field"
              style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.88rem' }}
            />

            <button onClick={handleCopy} className="btn btn-primary" style={{ padding: '0 20px' }}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
