import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DeckCard from '../components/DeckCard';
import FolderCard from '../components/FolderCard';
import ClassCard from '../components/ClassCard';
import {
  User,
  Flame,
  Brain,
  BookOpen,
  Folder,
  Users,
  Settings,
  Mail,
  Lock,
  ShieldAlert,
  Trash2,
  KeyRound,
  Unlink,
  Link2,
  ArrowLeft
} from 'lucide-react';

export default function ProfileView({ onOpenShare, onOpenJoinModal }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    users,
    currentUser,
    updateUserBio,
    updateUserEmail,
    updateUserPassword,
    unlinkProvider,
    loginWithProvider,
    deleteAccount,
    decks,
    folders,
    classes,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('decks');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Account Settings Form State
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const profileUser =
    users.find((u) => u.id === userId) ||
    (userId === currentUser?.id ? currentUser : users.find((u) => u.id === userId)) ||
    currentUser;
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

  // Filter items for profile view
  const userDecks = decks.filter(
    (d) => d.authorId === profileUser.id && (isMe || d.visibility === 'public')
  );
  const userFolders = folders.filter(
    (f) => f.ownerId === profileUser.id && (isMe || f.visibility === 'public')
  );
  const userClasses = classes.filter((c) => c.memberIds?.includes(profileUser.id));

  // Connected identity check
  const identities = currentUser?.identities || [];
  const googleIdentity = identities.find((i) => i.provider === 'google');
  const githubIdentity = identities.find((i) => i.provider === 'github');
  const isGoogleConnected = !!googleIdentity || currentUser?.provider === 'google';
  const isGithubConnected = !!githubIdentity || currentUser?.provider === 'github';

  const handleSaveBio = async () => {
    await updateUserBio(bioText);
    setIsEditingBio(false);
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setSavingEmail(true);
    const ok = await updateUserEmail(newEmail.trim());
    if (ok) setNewEmail('');
    setSavingEmail(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      addToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    setSavingPassword(true);
    const ok = await updateUserPassword(newPassword);
    if (ok) {
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
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
              src={
                profileUser.avatar ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${profileUser.username || profileUser.id}`
              }
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

          {isMe && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              <Settings size={16} />
              <span>Account Settings</span>
            </button>
          )}
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
              <strong style={{ color: '#0f172a' }}>{profileUser.streak || 1}</strong>{' '}
              {(profileUser.streak || 1) === 1 ? 'Day Streak' : 'Days Streak'}
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

        {isMe && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Settings size={16} />
            <span>Account Settings</span>
          </button>
        )}
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

      {/* Account Settings Content */}
      {activeTab === 'settings' && isMe && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680 }}>
          {/* Email Settings */}
          <div className="glass-card" style={{ padding: 24, background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Mail size={20} color="#2563eb" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Email Address</h3>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                  Primary email associated with your account
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Current Email:
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="input-field"
                  style={{ background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  New Email Address:
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input-field"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="submit" disabled={savingEmail || !newEmail} className="btn btn-primary btn-sm">
                  {savingEmail ? 'Updating...' : 'Update Email Address'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="glass-card" style={{ padding: 24, background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Lock size={20} color="#0d9488" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Password & Security</h3>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                  Update your login password to maintain security
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  New Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Confirm New Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="submit" disabled={savingPassword || !newPassword} className="btn btn-primary btn-sm">
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Connected Accounts & OAuth */}
          <div className="glass-card" style={{ padding: 24, background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#f5f3ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <KeyRound size={20} color="#7c3aed" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Connected Accounts</h3>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                  Manage third-party authentication providers linked to your account
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Google Provider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Google</div>
                    <div style={{ fontSize: '0.78rem', color: isGoogleConnected ? '#16a34a' : '#64748b' }}>
                      {isGoogleConnected ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                </div>

                {isGoogleConnected ? (
                  <button
                    onClick={() => googleIdentity && unlinkProvider(googleIdentity)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#dc2626' }}
                  >
                    <Unlink size={14} />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <button onClick={() => loginWithProvider('google')} className="btn btn-secondary btn-sm">
                    <Link2 size={14} />
                    <span>Connect Google</span>
                  </button>
                )}
              </div>

              {/* GitHub Provider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>GitHub</div>
                    <div style={{ fontSize: '0.78rem', color: isGithubConnected ? '#16a34a' : '#64748b' }}>
                      {isGithubConnected ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                </div>

                {isGithubConnected ? (
                  <button
                    onClick={() => githubIdentity && unlinkProvider(githubIdentity)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#dc2626' }}
                  >
                    <Unlink size={14} />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <button onClick={() => loginWithProvider('github')} className="btn btn-secondary btn-sm">
                    <Link2 size={14} />
                    <span>Connect GitHub</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="glass-card" style={{ padding: 24, background: '#fef2f2', border: '1px solid #fca5a5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldAlert size={20} color="#dc2626" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#991b1b' }}>Danger Zone</h3>
                <p style={{ color: '#b91c1c', fontSize: '0.82rem', margin: 0 }}>
                  Permanently delete your user profile, sets, folders, classes, and study history
                </p>
              </div>
            </div>

            {showDeleteConfirm ? (
              <div style={{ background: '#ffffff', border: '1px solid #f87171', borderRadius: 8, padding: 16, marginTop: 12 }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#991b1b', marginBottom: 10 }}>
                  Are you absolutely sure? Type <strong>DELETE</strong> below to confirm.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Type DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    style={{ height: 36, fontSize: '0.88rem' }}
                  />
                  <button
                    disabled={deleteConfirmText !== 'DELETE'}
                    onClick={async () => {
                      const ok = await deleteAccount();
                      if (ok) navigate('/');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#dc2626', borderColor: '#dc2626', whiteSpace: 'nowrap' }}
                  >
                    Confirm Delete
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                  <Trash2 size={15} />
                  <span>Delete Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
