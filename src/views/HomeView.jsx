import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DeckCard from '../components/DeckCard';
import FolderCard from '../components/FolderCard';
import ClassCard from '../components/ClassCard';
import {
  Flame,
  Brain,
  Sparkles,
  Plus,
  FolderPlus,
  Users,
  Star,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function HomeView({ onOpenShare, onOpenFolderModal, onOpenClassModal, onOpenJoinModal }) {
  const navigate = useNavigate();
  const {
    currentUser,
    decks,
    folders,
    classes,
    testResults
  } = useApp();

  const [activeTab, setActiveTab] = useState('decks');

  const myDecks = decks.filter((d) => d.authorId === currentUser?.id);
  const myFolders = folders.filter((f) => f.ownerId === currentUser?.id);
  const myClasses = classes.filter((c) => c.memberIds?.includes(currentUser?.id));

  const starredCards = [];
  decks.forEach((deck) => {
    (deck.cards || []).forEach((c) => {
      if (c.starred) {
        starredCards.push({ ...c, deckId: deck.id, deckTitle: deck.title });
      }
    });
  });

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: 32,
          marginBottom: 28,
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 580 }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>
              Welcome, {currentUser?.name || 'User'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Create flashcard sets, generate practice exams, organize folders, and collaborate in classes.
            </p>
          </div>

          {/* User Stats */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                flex: '1 1 130px',
                minWidth: 130,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <Flame size={18} color="#d97706" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentUser?.streak || 1}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  {(currentUser?.streak || 1) === 1 ? 'Day Streak' : 'Days Streak'}
                </div>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 130px',
                minWidth: 130,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <Brain size={18} color="#2563eb" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentUser?.cardsMastered || 0}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  Mastered
                </div>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 130px',
                minWidth: 130,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <Sparkles size={18} color="#16a34a" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentUser?.testsCompleted ?? testResults.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  {(currentUser?.testsCompleted ?? testResults.length) === 1 ? 'Test' : 'Tests'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: 24,
          paddingBottom: 12,
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('decks')}
            className={`btn ${activeTab === 'decks' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={16} />
            <span>My Sets ({myDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('folders')}
            className={`btn ${activeTab === 'folders' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FolderPlus size={16} />
            <span>My Folders ({myFolders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} />
            <span>My Classes ({myClasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('starred')}
            className={`btn ${activeTab === 'starred' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Star size={16} color="#d97706" />
            <span>Starred ({starredCards.length})</span>
          </button>
        </div>

        {/* Actions */}
        {activeTab === 'decks' && (
          <button onClick={() => navigate('/sets/create')} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Create Set</span>
          </button>
        )}
        {activeTab === 'folders' && (
          <button onClick={onOpenFolderModal} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Create Folder</span>
          </button>
        )}
        {activeTab === 'classes' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onOpenJoinModal} className="btn btn-secondary btn-sm" style={{ color: '#6d28d9' }}>
              <Users size={15} />
              <span>Join Class</span>
            </button>
            <button onClick={onOpenClassModal} className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Create Class</span>
            </button>
          </div>
        )}
      </div>

      {/* Displays */}
      {activeTab === 'decks' && (
        myDecks.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <BookOpen size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No flashcard sets yet</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Create your first flashcard set to start studying and taking practice tests.
            </p>
            <button onClick={() => navigate('/sets/create')} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Set</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {myDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onOpenShare={onOpenShare} />
            ))}
          </div>
        )
      )}

      {activeTab === 'folders' && (
        myFolders.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <FolderPlus size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No folders organized yet</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Group multiple sets into public or unlisted folders.
            </p>
            <button onClick={onOpenFolderModal} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Folder</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {myFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} onOpenShare={onOpenShare} />
            ))}
          </div>
        )
      )}

      {activeTab === 'classes' && (
        myClasses.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <Users size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Not in any classes</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Join a class with an invite code or create your own study class.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={onOpenJoinModal} className="btn btn-secondary">
                <span>Enter Class Code</span>
              </button>
              <button onClick={onOpenClassModal} className="btn btn-primary">
                <Plus size={16} />
                <span>Create Class</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {myClasses.map((cls) => (
              <ClassCard key={cls.id} cls={cls} onOpenJoinModal={onOpenJoinModal} />
            ))}
          </div>
        )
      )}

      {activeTab === 'starred' && (
        starredCards.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <Star size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No starred terms</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Star terms on your flashcards to flag them for priority review.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {starredCards.map((card) => (
              <div key={card.id} className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                    {card.deckTitle}
                  </span>
                  <Star size={16} color="#d97706" fill="#d97706" />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                  {card.term}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.4 }}>
                  {card.definition}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
