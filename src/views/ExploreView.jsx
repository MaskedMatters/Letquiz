import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DeckCard from '../components/DeckCard';
import FolderCard from '../components/FolderCard';
import ClassCard from '../components/ClassCard';
import { Compass, Search, BookOpen, Folder, Users, ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', 'Computer Science', 'Science', 'Languages', 'History', 'General'];

export default function ExploreView({ onOpenShare, onOpenJoinModal }) {
  const { decks, folders, classes, users, searchQuery, setSearchQuery, navigateTo } = useApp();

  const [selectedCat, setSelectedCat] = useState('All');
  const [activeTab, setActiveTab] = useState('decks');

  const publicDecks = decks.filter((d) => d.visibility === 'public');
  const publicFolders = folders.filter((f) => f.visibility === 'public');
  const publicClasses = classes;

  const matchSearch = (text) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filteredDecks = publicDecks.filter((d) => {
    const catMatch = selectedCat === 'All' || d.category === selectedCat;
    const textMatch = matchSearch(d.title) || matchSearch(d.description || '') || matchSearch(d.category || '');
    return catMatch && textMatch;
  });

  const filteredFolders = publicFolders.filter((f) => {
    return matchSearch(f.title) || matchSearch(f.description || '');
  });

  const filteredClasses = publicClasses.filter((c) => {
    const catMatch = selectedCat === 'All' || c.category === selectedCat;
    const textMatch = matchSearch(c.title) || matchSearch(c.description || '') || matchSearch(c.category || '');
    return catMatch && textMatch;
  });

  const filteredUsers = users.filter((u) => {
    return matchSearch(u.name) || matchSearch(u.username) || matchSearch(u.bio || '');
  });

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Search Header */}
      <div
        className="glass-card"
        style={{
          padding: 32,
          marginBottom: 28,
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Compass size={24} color="#2563eb" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Public Learning Sets</h1>
        </div>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          Search for public study sets, collections, and classes created by the community.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <Search
            size={18}
            color="#64748b"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search keywords or study set titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: 40,
              height: 44,
              fontSize: '0.95rem',
              borderRadius: 8,
              background: '#f8fafc'
            }}
          />
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`btn ${selectedCat === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab('decks')}
          className={`btn ${activeTab === 'decks' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} />
          <span>Public Sets ({filteredDecks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('folders')}
          className={`btn ${activeTab === 'folders' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Folder size={16} />
          <span>Public Folders ({filteredFolders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} />
          <span>Study Classes ({filteredClasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} />
          <span>Creators ({filteredUsers.length})</span>
        </button>
      </div>

      {/* Results Display */}
      {activeTab === 'decks' && (
        filteredDecks.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <BookOpen size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No public sets found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Create your own set or search for different keywords.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onOpenShare={onOpenShare} />
            ))}
          </div>
        )
      )}

      {activeTab === 'folders' && (
        filteredFolders.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <Folder size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No public folders found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              No public folders matching your search criteria.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} onOpenShare={onOpenShare} />
            ))}
          </div>
        )
      )}

      {activeTab === 'classes' && (
        filteredClasses.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <Users size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No classes found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Join a class with an invite code or create a new class.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filteredClasses.map((cls) => (
              <ClassCard key={cls.id} cls={cls} onOpenJoinModal={onOpenJoinModal} />
            ))}
          </div>
        )
      )}

      {activeTab === 'users' && (
        filteredUsers.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <Users size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No users found</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="glass-card glass-card-interactive"
                style={{ padding: 20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                    alt={user.name}
                    style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>@{user.username}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.4, marginBottom: 12 }}>
                  {user.bio || 'Letquiz user.'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    to={`/profile/${user.id}`}
                    style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                  >
                    View Profile <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
