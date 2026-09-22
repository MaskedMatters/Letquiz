import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DeckCard from '../components/DeckCard';
import FolderCard from '../components/FolderCard';
import ClassCard from '../components/ClassCard';
import { User, Flame, Brain, BookOpen, Folder, Users, UserCheck, ArrowLeft } from 'lucide-react';

export default function ProfileView({ onOpenShare, onOpenJoinModal }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, currentUser, updateUserBio, decks, folders, classes } = useApp();

  const [activeTab, setActiveTab] = useState('decks');
  const [isEditingBio, setIsEditingBio] = useState(false);

  const profileUser = users.find((u) => u.id === userId) || (userId === currentUser?.id ? currentUser : users.find(u => u.id === userId)) || currentUser;
  const isMe = currentUser?.id === profileUser?.id;

  const [bioText, setBioText] = useState(profileUser?.bio || '');

  if (!profileUser) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', marginTop: 40 }}>
        <h2>User Profile Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          This user profile does not exist or has been removed.
        </p>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    );
  }

  // Filter public items for profile view unless viewing self
  const userDecks = decks.filter(
    (d) => d.authorId === profileUser.id && (isMe || d.visibility === 'public')
  );
  const userFolders = folders.filter(
    (f) => f.ownerId === profileUser.id && (isMe || f.visibility === 'public')
  );
  const userClasses = classes.filter((c) => c.memberIds?.includes(profileUser.id));

  const handleSaveBio = async () => {
    await updateUserBio(bioText);
    setIsEditingBio(false);
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* User Header Hero */}
      <div
        className="glass-card"
        style={{
          padding: 32,
          marginBottom: 28,
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
            <img
              src={profileUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${profileUser.username || profileUser.id}`}
              alt={profileUser.name}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: '3px solid #93c5fd',
                objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{profileUser.name}</h1>
                <span className="badge badge-public" style={{ fontSize: '0.75rem' }}>
                  @{profileUser.username || profileUser.name?.toLowerCase().replace(/\s+/g, '')}
                </span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#2563eb', fontWeight: 600, marginTop: 2 }}>
                {profileUser.role || 'Member'}
              </div>

              {isEditingBio ? (
                <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', maxWidth: 540 }}>
                  <input
                    type="text"
                    className="input-field"
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    placeholder="Write a brief bio about yourself..."
                    style={{ height: 36, fontSize: '0.88rem' }}
                  />
                  <button onClick={handleSaveBio} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    Save Bio
                  </button>
                  <button onClick={() => setIsEditingBio(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: 540, margin: 0 }}>
                    {profileUser.bio || 'Letquiz study deck author.'}
                  </p>
                  {isMe && (
                    <button
                      onClick={() => {
                        setBioText(profileUser.bio || '');
                        setIsEditingBio(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 8px', fontSize: '0.75rem', height: 26 }}
                    >
                      Edit Bio
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={18} color="#d97706" />
            <span style={{ fontSize: '0.9rem', color: '#475569' }}>
              <strong style={{ color: '#0f172a' }}>{profileUser.streak || 1}</strong> {(profileUser.streak || 1) === 1 ? 'Day Streak' : 'Days Streak'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={18} color="#2563eb" />
            <span style={{ fontSize: '0.9rem', color: '#475569' }}>
              <strong style={{ color: '#0f172a' }}>{profileUser.cardsMastered || 0}</strong> Cards Mastered
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={18} color="#0284c7" />
            <span style={{ fontSize: '0.9rem', color: '#475569' }}>
              <strong style={{ color: '#0f172a' }}>{userDecks.length}</strong> Sets
            </span>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab('decks')}
          className={`btn ${activeTab === 'decks' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} />
          <span>Sets ({userDecks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('folders')}
          className={`btn ${activeTab === 'folders' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Folder size={16} />
          <span>Folders ({userFolders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} />
          <span>Classes ({userClasses.length})</span>
        </button>
      </div>

      {/* Tab Displays */}
      {activeTab === 'decks' && (
        userDecks.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <BookOpen size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No flashcard sets yet</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {userDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onOpenShare={onOpenShare} />
            ))}
          </div>
        )
      )}

      {activeTab === 'folders' && (
        userFolders.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <Folder size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No folders yet</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {userFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} onOpenShare={onOpenShare} />
            ))}
          </div>
        )
      )}

      {activeTab === 'classes' && (
        userClasses.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <Users size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No classes yet</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {userClasses.map((cls) => (
              <ClassCard key={cls.id} cls={cls} onOpenJoinModal={onOpenJoinModal} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

