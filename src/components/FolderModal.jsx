import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Folder, Eye, EyeOff, Lock, Check } from 'lucide-react';

const COLORS = ['#2563eb', '#7c3aed', '#0284c7', '#059669', '#d97706', '#e11d48'];

export default function FolderModal({ folderToEdit, onClose }) {
  const { currentUser, decks, createFolder, updateFolder } = useApp();

  const userDecks = decks.filter((d) => d.authorId === currentUser?.id);

  const [title, setTitle] = useState(folderToEdit?.title || '');
  const [description, setDescription] = useState(folderToEdit?.description || '');
  const [color, setColor] = useState(folderToEdit?.color || '#2563eb');
  const [visibility, setVisibility] = useState(folderToEdit?.visibility || 'public');
  const [selectedDeckIds, setSelectedDeckIds] = useState(folderToEdit?.deckIds || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (folderToEdit) {
      updateFolder(folderToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        color,
        visibility,
        deckIds: selectedDeckIds
      });
    } else {
      createFolder({
        title: title.trim(),
        description: description.trim(),
        color,
        visibility,
        deckIds: selectedDeckIds
      });
    }
    onClose();
  };

  const toggleDeck = (deckId) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId)
        ? prev.filter((id) => id !== deckId)
        : [...prev, deckId]
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', color: '#0f172a' }}>
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
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Folder size={20} color="#ffffff" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              {folderToEdit ? 'Edit Folder' : 'Create New Folder'}
            </h3>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
              Folder Title *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. CS Core Fundamentals & Algorithms"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
              Description
            </label>
            <textarea
              className="input-field"
              placeholder="What topics or sets are inside this folder?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Color Accent Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
              Color Theme
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '3px solid #0f172a' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {color === c && <Check size={16} color="#fff" />}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Options */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
              Folder Visibility Settings
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div
                onClick={() => setVisibility('public')}
                style={{
                  background: visibility === 'public' ? '#ecfdf5' : '#f8fafc',
                  border: visibility === 'public' ? '2px solid #059669' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 12,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Eye size={18} color={visibility === 'public' ? '#059669' : '#64748b'} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Public</div>
                <div style={{ fontSize: '0.72rem', color: '#475569' }}>Searchable</div>
              </div>

              <div
                onClick={() => setVisibility('unlisted')}
                style={{
                  background: visibility === 'unlisted' ? '#fffbeb' : '#f8fafc',
                  border: visibility === 'unlisted' ? '2px solid #d97706' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 12,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <EyeOff size={18} color={visibility === 'unlisted' ? '#d97706' : '#64748b'} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Unlisted</div>
                <div style={{ fontSize: '0.72rem', color: '#475569' }}>Link / Class</div>
              </div>

              <div
                onClick={() => setVisibility('private')}
                style={{
                  background: visibility === 'private' ? '#f1f5f9' : '#f8fafc',
                  border: visibility === 'private' ? '2px solid #475569' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 12,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Lock size={18} color={visibility === 'private' ? '#334155' : '#64748b'} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Private</div>
                <div style={{ fontSize: '0.72rem', color: '#475569' }}>Only You</div>
              </div>
            </div>
          </div>

          {/* Add Decks Selection */}
          {userDecks.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
                Include Sets in this Folder:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 140, overflowY: 'auto' }}>
                {userDecks.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => toggleDeck(d.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: selectedDeckIds.includes(d.id) ? '#eff6ff' : '#f8fafc',
                      border: selectedDeckIds.includes(d.id) ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0f172a' }}>{d.title}</span>
                    <input
                      type="checkbox"
                      checked={selectedDeckIds.includes(d.id)}
                      onChange={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {folderToEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

