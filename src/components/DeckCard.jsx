import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Share2,
  Sparkles,
  Layers,
  GitFork
} from 'lucide-react';

export default function DeckCard({ deck, onOpenShare }) {
  const { users } = useApp();
  const navigate = useNavigate();
  const author = users.find((u) => u.id === deck.authorId) || { id: deck.authorId, name: 'User', avatar: '' };

  const getVisibilityBadge = () => {
    if (deck.visibility === 'public') {
      return (
        <span className="badge badge-public">
          <Eye size={12} /> Public
        </span>
      );
    }
    if (deck.visibility === 'unlisted') {
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

  const setUrl = `/sets/${author.id || 'user'}/${deck.id}`;
  const flashcardUrl = `/flashcards/${author.id || 'user'}/${deck.id}`;
  const testUrl = `/test/${author.id || 'user'}/${deck.id}`;
  const profileUrl = `/profile/${author.id || 'user'}`;

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 220,
        background: '#ffffff'
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="cat-tag">
            {deck.category || 'General'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {getVisibilityBadge()}
            {onOpenShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShare('deck', deck);
                }}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 6,
                  padding: 4,
                  color: '#64748b',
                  cursor: 'pointer'
                }}
                title="Share unlisted link"
              >
                <Share2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <Link
          to={setUrl}
          style={{
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 4,
            display: 'block',
            lineHeight: 1.3,
            transition: 'color 0.15s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
        >
          {deck.title}
        </Link>

        {deck.forkedFrom && (
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <GitFork size={12} color="#2563eb" />
            <span>Forked from {deck.forkedFrom.authorName}</span>
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
          {deck.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid #e2e8f0',
            marginBottom: 12
          }}
        >
          <Link
            to={profileUrl}
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
          >
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
              {author.name}
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#64748b' }}>
            <Layers size={14} color="#2563eb" />
            <span>{deck.cards?.length || 0} terms</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Link
            to={flashcardUrl}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            <BookOpen size={14} color="#2563eb" />
            <span>Flashcards</span>
          </Link>

          <Link
            to={testUrl}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            <Sparkles size={14} />
            <span>Practice Test</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
