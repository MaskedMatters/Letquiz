import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Sparkles,
  Share2,
  Edit,
  Trash2,
  Star,
  Volume2,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Layers,
  Calendar,
  GitFork
} from 'lucide-react';

export default function DeckDetailView({ onOpenShare }) {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const {
    decks,
    users,
    currentUser,
    deleteDeck,
    duplicateDeck,
    toggleStarCard,
    addToast
  } = useApp();

  const deck = decks.find((d) => d.id === deckId);

  if (!deck) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', marginTop: 40 }}>
        <h2>Flashcard Set Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          This deck may have been removed or the link is invalid.
        </p>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Return Home
        </Link>
      </div>
    );
  }

  const author = users.find((u) => u.id === deck.authorId) || { id: deck.authorId, name: 'User' };
  const isOwner = currentUser?.id === deck.authorId;

  const handleForkSet = async () => {
    const newDeckId = await duplicateDeck(deck.id);
    if (newDeckId && currentUser) {
      navigate(`/sets/${currentUser.id}/${newDeckId}`);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      addToast('Playing audio pronunciation...', 'info');
    } else {
      addToast('Speech synthesis not supported in browser', 'error');
    }
  };

  const getVisibilityBadge = () => {
    if (deck.visibility === 'public') {
      return (
        <span className="badge badge-public">
          <Eye size={12} /> Public Set
        </span>
      );
    }
    if (deck.visibility === 'unlisted') {
      return (
        <span className="badge badge-unlisted">
          <EyeOff size={12} /> Unlisted Link
        </span>
      );
    }
    return (
      <span className="badge badge-private">
        <Lock size={12} /> Private
      </span>
    );
  };

  const flashcardUrl = `/flashcards/${author.id || 'user'}/${deck.id}`;
  const testUrl = `/test/${author.id || 'user'}/${deck.id}`;
  const editUrl = `/edit-set/${deck.id}`;

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Back Button */}
      <Link
        to="/"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 20, textDecoration: 'none' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      {/* Deck Header Card */}
      <div
        className="glass-card"
        style={{
          padding: 32,
          marginBottom: 28,
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="cat-tag">
              {deck.category || 'General'}
            </span>
            {getVisibilityBadge()}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.82rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} color="#2563eb" />
              <span>{deck.cards?.length || 0} Terms</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} />
              <span>Created {deck.createdAt}</span>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: 10, color: '#0f172a' }}>
          {deck.title}
        </h1>

        {deck.forkedFrom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', color: '#64748b', marginBottom: 12 }}>
            <GitFork size={14} color="#2563eb" />
            <span>Forked from</span>
            <Link
              to={`/sets/${deck.forkedFrom.authorId}/${deck.forkedFrom.id}`}
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
            >
              {deck.forkedFrom.authorName} / {deck.forkedFrom.title}
            </Link>
          </div>
        )}

        <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.5, marginBottom: 24, maxWidth: 800 }}>
          {deck.description || 'No description provided for this study set.'}
        </p>

        {/* Author Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
          <Link
            to={`/profile/${author.id || 'user'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
          >
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Created by {author.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>@{author.username || 'user'}</div>
            </div>
          </Link>

          {/* Action Hub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Link
              to={flashcardUrl}
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <BookOpen size={18} />
              <span>Flashcards Mode</span>
            </Link>

            <Link
              to={testUrl}
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              <Sparkles size={18} color="#2563eb" />
              <span>Practice Test</span>
            </Link>

            <button
              onClick={() => onOpenShare('deck', deck)}
              className="btn btn-secondary"
              title="Share link"
            >
              <Share2 size={18} color="#d97706" />
              <span>Share</span>
            </button>

            {currentUser && (
              <button
                onClick={handleForkSet}
                className="btn btn-secondary"
              >
                <GitFork size={18} color="#2563eb" />
                <span>Duplicate Set</span>
              </button>
            )}

            {isOwner && (
              <>
                <Link
                  to={editUrl}
                  className="btn btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this deck?')) {
                      deleteDeck(deck.id);
                      navigate('/');
                    }
                  }}
                  className="btn btn-danger"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cards List Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          Terms in this set ({deck.cards?.length || 0})
        </h2>
        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Click audio icon to listen to pronunciation
        </span>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(deck.cards || []).map((card, index) => (
          <div
            key={card.id || index}
            className="glass-card"
            style={{
              padding: 20,
              display: 'grid',
              gridTemplateColumns: '1fr 2fr auto',
              gap: 20,
              alignItems: 'center',
              background: '#ffffff'
            }}
          >
            {/* Term */}
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#2563eb', borderRight: '1px solid #e2e8f0', paddingRight: 16 }}>
              {card.term}
            </div>

            {/* Definition */}
            <div style={{ fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.5 }}>
              {card.definition}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => speakText(`${card.term}. Definition: ${card.definition}`)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: 7,
                  color: '#64748b',
                  cursor: 'pointer'
                }}
                title="Listen to pronunciation"
              >
                <Volume2 size={16} />
              </button>

              <button
                onClick={() => toggleStarCard(deck.id, card.id)}
                style={{
                  background: card.starred ? '#fffbeb' : '#f1f5f9',
                  border: card.starred ? '1px solid #fde68a' : '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: 7,
                  color: card.starred ? '#d97706' : '#64748b',
                  cursor: 'pointer'
                }}
                title={card.starred ? 'Unstar term' : 'Star term for priority review'}
              >
                <Star size={16} fill={card.starred ? '#d97706' : 'none'} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
