import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DeckCard from '../components/DeckCard';
import {
  Folder,
  Eye,
  EyeOff,
  Lock,
  Share2,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  BookOpen,
  Check,
  X,
  GitFork
} from 'lucide-react';

export default function FolderDetailView({ onOpenShare, onOpenEditFolder }) {
  const { userId, folderId } = useParams();
  const navigate = useNavigate();
  const {
    folders,
    decks,
    users,
    currentUser,
    deleteFolder,
    duplicateFolder,
    toggleDeckInFolder
  } = useApp();

  const [showAddDecksModal, setShowAddDecksModal] = useState(false);

  const folder = folders.find((f) => f.id === folderId);

  if (!folder) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', marginTop: 40 }}>
        <h2>Folder Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          This folder may have been removed or the link is invalid.
        </p>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    );
  }

  const owner = users.find((u) => u.id === folder.ownerId) || { name: 'User' };
  const isOwner = currentUser?.id === folder.ownerId;
  const hasAccess = folder.visibility !== 'private' || isOwner;

  // Decks contained in this folder
  const folderDecks = decks.filter((d) => (folder.deckIds || []).includes(d.id));

  const handleForkFolder = async () => {
    const newFolderId = await duplicateFolder(folder.id);
    if (newFolderId && currentUser) {
      navigate(`/folders/${currentUser.id}/${newFolderId}`);
    }
  };

  const getVisibilityBadge = () => {
    if (folder.visibility === 'public') {
      return (
        <span className="badge badge-public">
          <Eye size={12} /> Public Folder
        </span>
      );
    }
    if (folder.visibility === 'unlisted') {
      return (
        <span className="badge badge-unlisted">
          <EyeOff size={12} /> Unlisted Link
        </span>
      );
    }
    return (
      <span className="badge badge-private">
        <Lock size={12} /> Private Folder
      </span>
    );
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

      {/* Folder Header */}
      <div
        className="glass-card"
        style={{
          padding: 32,
          marginBottom: 28,
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: folder.color || '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Folder size={24} color="#ffffff" />
            </div>
            {getVisibilityBadge()}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => onOpenShare('folder', folder)}
              className="btn btn-secondary"
            >
              <Share2 size={16} color="#2563eb" />
              <span>Share Link</span>
            </button>

            {currentUser && (
              <button
                onClick={handleForkFolder}
                className="btn btn-secondary"
              >
                <GitFork size={16} color="#2563eb" />
                <span>Duplicate Folder</span>
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => setShowAddDecksModal(true)}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  <span>Add Sets to Folder</span>
                </button>

                <button
                  onClick={() => onOpenEditFolder(folder)}
                  className="btn btn-secondary"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Delete this folder?')) {
                      await deleteFolder(folder.id);
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

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
          {folder.title}
        </h1>

        {folder.forkedFrom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', color: '#64748b', marginBottom: 12 }}>
            <GitFork size={14} color="#2563eb" />
            <span>Forked from</span>
            <Link
              to={`/folders/${folder.forkedFrom.ownerId}/${folder.forkedFrom.id}`}
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
            >
              {folder.forkedFrom.ownerName} / {folder.forkedFrom.title}
            </Link>
          </div>
        )}

        <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.5, marginBottom: 20 }}>
          {folder.description || 'No folder description provided.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#64748b' }}>
          <span>Organized by <Link to={`/profile/${folder.ownerId}`} style={{ color: '#2563eb', fontWeight: 600 }}>{owner.name}</Link></span>
          <span>•</span>
          <span>{folderDecks.length} Flashcard Sets</span>
        </div>
      </div>

      {!hasAccess ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center', maxWidth: 540, margin: '40px auto 0', background: '#ffffff' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={28} color="#475569" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            This Folder is Private
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: 20 }}>
            Only the owner of this folder can view its contents and study sets.
          </p>
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      ) : (
        <div>
          {/* Decks Grid */}
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
            Sets in this Folder ({folderDecks.length})
          </h2>

          {folderDecks.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <BookOpen size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>No sets inside this folder</h3>
              <p style={{ color: '#64748b', marginBottom: 20 }}>
                Add existing flashcard sets or create a new set to include in this folder.
              </p>
              {isOwner && (
                <button onClick={() => setShowAddDecksModal(true)} className="btn btn-primary">
                  <Plus size={18} />
                  <span>Add Sets Now</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {folderDecks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} onOpenShare={onOpenShare} />
              ))}
            </div>
          )}

          {/* Modal to Manage Sets inside Folder */}
          {showAddDecksModal && (
            <div className="modal-overlay" onClick={() => setShowAddDecksModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add/Remove Sets in Folder</h3>
                  <button onClick={() => setShowAddDecksModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                  {decks.map((deck) => {
                    const inFolder = (folder.deckIds || []).includes(deck.id);
                    return (
                      <div
                        key={deck.id}
                        onClick={() => toggleDeckInFolder(folder.id, deck.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: inFolder ? '#eff6ff' : '#f8fafc',
                          border: inFolder ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                          borderRadius: 10,
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{deck.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{deck.cards?.length || 0} terms</div>
                        </div>
                        {inFolder ? <Check size={18} color="#2563eb" /> : <Plus size={18} color="#64748b" />}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <button onClick={() => setShowAddDecksModal(false)} className="btn btn-primary">
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

