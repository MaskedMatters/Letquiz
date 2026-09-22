import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  Star,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function FlashcardStudyView() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { decks, toggleStarCard, addToast } = useApp();

  const deck = decks.find((d) => d.id === deckId);
  const [filterStarred, setFilterStarred] = useState(false);

  const rawCards = deck?.cards || [];
  const cards = filterStarred ? rawCards.filter((c) => c.starred) : rawCards;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length, isFlipped]);

  if (!deck || cards.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', marginTop: 40 }}>
        <h2>No Cards Available to Study</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          {filterStarred ? 'No starred terms in this set yet.' : 'This set has no cards.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {filterStarred && (
            <button onClick={() => setFilterStarred(false)} className="btn btn-secondary">
              Study All Terms
            </button>
          )}
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Back to Set
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  const speakText = (e, text) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const authorId = deck.authorId || 'user';
  const testUrl = `/test/${authorId}/${deck.id}`;
  const deckUrl = `/sets/${authorId}/${deck.id}`;

  return (
    <div style={{ paddingBottom: 60, maxWidth: 840, margin: '0 auto' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Link
          to={deckUrl}
          className="btn btn-secondary btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Exit Study Mode</span>
        </Link>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{deck.title}</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Card {currentIndex + 1} of {cards.length}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              setFilterStarred(!filterStarred);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`btn ${filterStarred ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Star size={14} color="#d97706" fill={filterStarred ? '#d97706' : 'none'} />
            <span>Starred ({rawCards.filter((c) => c.starred).length})</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: 6,
          background: '#e2e8f0',
          borderRadius: 999,
          marginBottom: 32,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((currentIndex + 1) / cards.length) * 100}%`,
            background: '#2563eb',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* Study Deck Screen */}
      {isCompleted ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <CheckCircle2 size={32} color="#16a34a" />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
            Reviewed all {cards.length} cards
          </h2>

          <p style={{ color: '#64748b', marginBottom: 24 }}>
            Test your knowledge with the Practice Test Generator.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={handleRestart} className="btn btn-secondary">
              <RotateCcw size={16} />
              <span>Review Again</span>
            </button>

            <Link
              to={testUrl}
              className="btn btn-accent-cyan"
              style={{ textDecoration: 'none' }}
            >
              <Sparkles size={16} />
              <span>Take Practice Test</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* 3D Interactive Flashcard */}
          <div className="flashcard-wrapper" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
              {/* Front Side (Term) */}
              <div className="flashcard-face">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    TERM
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={(e) => speakText(e, currentCard.term)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      <Volume2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarCard(deck.id, currentCard.id);
                      }}
                      style={{ background: 'none', border: 'none', color: currentCard.starred ? '#d97706' : '#64748b', cursor: 'pointer' }}
                    >
                      <Star size={18} fill={currentCard.starred ? '#d97706' : 'none'} />
                    </button>
                  </div>
                </div>

                <div className="flashcard-content">
                  {currentCard.term}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                  Click or press [Space] to flip card
                </div>
              </div>

              {/* Back Side (Definition) */}
              <div className="flashcard-face flashcard-back">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    DEFINITION
                  </span>
                  <button
                    onClick={(e) => speakText(e, currentCard.definition)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <div className="flashcard-content" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                  {currentCard.definition}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#2563eb', textAlign: 'center' }}>
                  Click or press [Space] to flip back
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              marginTop: 32
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
              style={{ padding: '10px 20px', opacity: currentIndex === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
              Use ← → arrow keys
            </span>

            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ padding: '10px 20px' }}
            >
              <span>{currentIndex === cards.length - 1 ? 'Finish Study' : 'Next'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
