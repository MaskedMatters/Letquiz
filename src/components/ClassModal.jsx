import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Users, KeyRound, Globe, FolderCheck } from 'lucide-react';

const BANNERS = [
  'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
  'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  'linear-gradient(135deg, #059669 0%, #047857 100%)',
  'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
];

export default function ClassModal({ onClose }) {
  const { currentUser, folders, createClass } = useApp();

  const userFolders = folders.filter((f) => f.ownerId === currentUser?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [bannerColor, setBannerColor] = useState(BANNERS[0]);
  const [isInviteOnly, setIsInviteOnly] = useState(true);
  const [selectedFolderIds, setSelectedFolderIds] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createClass({
      title: title.trim(),
      description: description.trim(),
      category,
      bannerColor,
      isInviteOnly,
      folderIds: selectedFolderIds
    });
    onClose();
  };

  const toggleFolder = (folderId) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
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
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={20} color="#ffffff" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Create Study Class Hub</h3>
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
              Classroom Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Neuroscience Honors Lab"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
                Category
              </label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Science">Science & Medicine</option>
                <option value="Languages">Languages</option>
                <option value="History">History & Humanities</option>
                <option value="Business">Business & Tech</option>
                <option value="General">General Study Group</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
                Banner Theme
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {BANNERS.map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBannerColor(b)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: b,
                      border: bannerColor === b ? '2px solid #0f172a' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
              Classroom Overview / Description
            </label>
            <textarea
              className="input-field"
              placeholder="Explain the purpose of this study cohort or community..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Access Policy Toggle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
              Access & Membership Security
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div
                onClick={() => setIsInviteOnly(true)}
                style={{
                  background: isInviteOnly ? '#f5f3ff' : '#f8fafc',
                  border: isInviteOnly ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 14,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <KeyRound size={18} color={isInviteOnly ? '#7c3aed' : '#64748b'} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    Invite-Only Class
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  Generates a unique 6-digit access code. Members require code to join and unlock unlisted class folders.
                </div>
              </div>

              <div
                onClick={() => setIsInviteOnly(false)}
                style={{
                  background: !isInviteOnly ? '#ecfdf5' : '#f8fafc',
                  border: !isInviteOnly ? '2px solid #059669' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 14,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Globe size={18} color={!isInviteOnly ? '#059669' : '#64748b'} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    Public Class
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  Open to all Letquiz users. Appears in search results and directory hubs.
                </div>
              </div>
            </div>
          </div>

          {/* Link Folders to Class */}
          {userFolders.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
                Include Folders into Class Hub:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflowY: 'auto' }}>
                {userFolders.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => toggleFolder(f.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: selectedFolderIds.includes(f.id) ? '#eff6ff' : '#f8fafc',
                      border: selectedFolderIds.includes(f.id) ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FolderCheck size={16} color={f.color || '#2563eb'} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0f172a' }}>{f.title}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedFolderIds.includes(f.id)}
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
              Create Study Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

