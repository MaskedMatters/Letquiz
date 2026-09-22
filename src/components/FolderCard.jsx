import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Folder, Eye, EyeOff, Lock, Share2, ArrowRight, GitFork } from 'lucide-react';

export default function FolderCard({ folder, onOpenShare }) {
  const { users } = useApp();
  const owner = users.find((u) => u.id === folder.ownerId) || { id: folder.ownerId, name: 'User' };

  const getVisibilityBadge = () => {
    if (folder.visibility === 'public') {
      return (
        <span className="badge badge-public">
          <Eye size={12} /> Public
        </span>
      );
    }
    if (folder.visibility === 'unlisted') {
      return (
        <span className="badge badge-unlisted">
          <EyeOff size={12} /> Unlisted
        </span>
      );
    }
    return (
      <span className="badge badge-private">
        <Lock size={12} /> Private
      </span>
    );
  };

  const folderUrl = `/folders/${owner.id || 'user'}/${folder.id}`;

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 190,
        background: '#ffffff'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: folder.color || '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Folder size={18} color="#ffffff" />
            </div>
            {getVisibilityBadge()}
          </div>

          {onOpenShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenShare('folder', folder);
              }}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 6,
                padding: 5,
                color: '#64748b',
                cursor: 'pointer'
              }}
              title="Copy Unlisted Share Link"
            >
              <Share2 size={14} />
            </button>
          )}
        </div>

        <Link
          to={folderUrl}
          style={{
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 4,
            display: 'block',
            transition: 'color 0.15s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
        >
          {folder.title}
        </Link>

        {folder.forkedFrom && (
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <GitFork size={12} color="#2563eb" />
            <span>Forked from {folder.forkedFrom.ownerName}</span>
          </div>
        )}

        <p
          style={{
            fontSize: '0.86rem',
            color: '#64748b',
            lineHeight: 1.4,
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {folder.description || 'No description provided.'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          By {owner.name}
        </span>
        <Link
          to={folderUrl}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.8rem', padding: '4px 10px', textDecoration: 'none' }}
        >
          <span>{folder.deckIds?.length || 0} Sets</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
