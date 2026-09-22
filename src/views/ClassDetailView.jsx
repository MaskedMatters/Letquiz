import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FolderCard from '../components/FolderCard';
import {
  Users,
  KeyRound,
  Globe,
  Share2,
  FolderPlus,
  MessageSquare,
  Send,
  UserCheck,
  LogOut,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';

export default function ClassDetailView({ onOpenShare }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const {
    classes,
    folders,
    users,
    currentUser,
    addFolderToClass,
    postAnnouncement,
    leaveClass,
    joinClassWithInviteCode,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('feed'); // feed, folders, members
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputCode, setInputCode] = useState('');

  const cls = classes.find((c) => c.id === classId);

  if (!cls) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', marginTop: 40 }}>
        <h2>Class Hub Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          This class hub may have been deleted or the link is invalid.
        </p>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?.id === cls.ownerId;
  const isMember = cls.memberIds?.includes(currentUser?.id);
  const hasAccess = !cls.isInviteOnly || isMember || isOwner;

  // Folders linked to this class
  const classFolders = folders.filter((f) => (cls.folderIds || []).includes(f.id));
  const classMembers = users.filter((u) => (cls.memberIds || []).includes(u.id));

  // User's own folders to add to class
  const userFolders = folders.filter((f) => f.ownerId === currentUser?.id);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(cls.inviteCode);
    setCopiedCode(true);
    addToast(`Class invite code ${cls.inviteCode} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    await joinClassWithInviteCode(inputCode.trim());
    setInputCode('');
  };

  const handlePostAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementBody.trim()) return;

    postAnnouncement(cls.id, announcementTitle.trim(), announcementBody.trim());
    setAnnouncementTitle('');
    setAnnouncementBody('');
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

      {/* Class Hero Banner */}
      <div
        className="glass-card"
        style={{
          overflow: 'hidden',
          marginBottom: 28,
          background: '#ffffff'
        }}
      >
        <div
          style={{
            background: cls.bannerColor || 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            padding: '32px 36px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.95)',
                letterSpacing: '0.05em'
              }}
            >
              {cls.category || 'Classroom'}
            </span>

            {cls.isInviteOnly ? (
              (isMember || isOwner) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="badge badge-invite" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                    <KeyRound size={14} /> Secret Code: {cls.inviteCode}
                  </span>

                  <button
                    onClick={handleCopyInviteCode}
                    className="btn btn-secondary btn-sm"
                    style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                  >
                    {copiedCode ? <Check size={14} /> : <Share2 size={14} />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              ) : (
                <span className="badge badge-invite" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                  <KeyRound size={14} /> Invite-Only Class
                </span>
              )
            ) : (
              <span className="badge badge-public" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                <Globe size={14} /> Open Public Class
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginTop: 12, marginBottom: 8 }}>
            {cls.title}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', maxWidth: 720, lineHeight: 1.5 }}>
            {cls.description}
          </p>
        </div>

        {/* Sub-bar */}
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.88rem', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={16} color="#2563eb" />
              <span>{classMembers.length} Members</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FolderPlus size={16} color="#0284c7" />
              <span>{classFolders.length} Shared Folders</span>
            </div>
          </div>

          {isMember && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to leave this class? If the admin leaves or roster drops to 0, the class will be deleted.')) {
                  leaveClass(cls.id);
                  navigate('/explore');
                }
              }}
              className="btn btn-danger btn-sm"
            >
              <LogOut size={14} />
              <span>Leave Class</span>
            </button>
          )}
        </div>
      </div>

      {!hasAccess ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center', maxWidth: 540, margin: '40px auto 0', background: '#ffffff' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <KeyRound size={28} color="#7c3aed" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            This Class Hub is Invite-Only
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: 24 }}>
            You are not enrolled in this class. Enter the 6-digit access code provided by your class admin to join and unlock shared folders, roster, and announcements.
          </p>
          <form onSubmit={handleJoinSubmit} style={{ display: 'flex', gap: 10, maxWidth: 360, margin: '0 auto' }}>
            <input
              type="text"
              required
              maxLength={6}
              className="input-field"
              placeholder="e.g. 849201"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.15em', fontWeight: 700 }}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Unlock & Join
            </button>
          </form>
        </div>
      ) : (
        <div>
          {/* Class Hub Tabs */}
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
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setActiveTab('feed')}
                className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <MessageSquare size={16} />
                <span>Class Feed & Announcements ({cls.announcements?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('folders')}
                className={`btn ${activeTab === 'folders' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <FolderPlus size={16} />
                <span>Class Folders ({classFolders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Users size={16} />
                <span>Roster ({classMembers.length})</span>
              </button>
            </div>

            {activeTab === 'folders' && isMember && (
              <button onClick={() => setShowAddFolderModal(true)} className="btn btn-primary btn-sm">
                <FolderPlus size={15} />
                <span>Add Folder to Class</span>
              </button>
            )}
          </div>

          {/* 1. Announcements Feed Tab */}
          {activeTab === 'feed' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
              {/* Announcements Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(cls.announcements || []).length === 0 ? (
                  <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                    <MessageSquare size={36} color="#94a3b8" style={{ marginBottom: 8 }} />
                    <h4 style={{ fontSize: '1rem', color: '#64748b' }}>No announcements posted yet</h4>
                  </div>
                ) : (
                  (cls.announcements || []).map((ann) => {
                    const author = users.find((u) => u.id === ann.authorId || u.id === ann.authorName);
                    const authorName = author ? author.name : (ann.authorName && !ann.authorName.includes('-') ? ann.authorName : 'Member');
                    const authorAvatar = author ? author.avatar : (ann.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${ann.authorId || 'user'}`);

                    return (
                      <div key={ann.id} className="glass-card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{authorName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ann.createdAt}</div>
                          </div>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                          {ann.title}
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5 }}>
                          {ann.body}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Post New Announcement Sidebar */}
              <div>
                <div className="glass-card" style={{ padding: 24 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                    Post Class Announcement
                  </h3>
                  <form onSubmit={handlePostAnnouncementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Announcement title..."
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                    />
                    <textarea
                      required
                      className="input-field"
                      placeholder="Post update, study reminders, or set links..."
                      value={announcementBody}
                      onChange={(e) => setAnnouncementBody(e.target.value)}
                      style={{ minHeight: 90 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      <Send size={15} />
                      <span>Post Announcement</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* 2. Class Shared Folders Tab */}
          {activeTab === 'folders' && (
            <div>
              {classFolders.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                  <FolderPlus size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>No folders linked to this class yet</h3>
                  <p style={{ color: '#64748b', marginBottom: 20 }}>
                    Class members can add public or unlisted study folders for everyone to access.
                  </p>
                  {isMember && (
                    <button onClick={() => setShowAddFolderModal(true)} className="btn btn-primary">
                      <FolderPlus size={18} />
                      <span>Link a Folder</span>
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {classFolders.map((folder) => (
                    <FolderCard key={folder.id} folder={folder} onOpenShare={onOpenShare} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Class Roster Tab */}
          {activeTab === 'members' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {classMembers.map((member) => (
                <div key={member.id} className="glass-card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img
                    src={member.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${member.username}`}
                    alt={member.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #93c5fd', objectFit: 'cover' }}
                  />
                  <div>
                    <Link to={`/profile/${member.id}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', textDecoration: 'none' }}>
                      {member.name}
                    </Link>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>@{member.username}</div>
                    {member.id === cls.ownerId && (
                      <span className="badge badge-invite" style={{ marginTop: 4, fontSize: '0.68rem', padding: '2px 6px' }}>
                        Class Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Folder Modal */}
          {showAddFolderModal && (
            <div className="modal-overlay" onClick={() => setShowAddFolderModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Folder to Class Hub</h3>
                  <button onClick={() => setShowAddFolderModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }}>
                  {userFolders.map((f) => {
                    const inClass = (cls.folderIds || []).includes(f.id);
                    return (
                      <div
                        key={f.id}
                        onClick={() => {
                          if (!inClass) addFolderToClass(cls.id, f.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: inClass ? '#eff6ff' : '#f8fafc',
                          border: inClass ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                          borderRadius: 10,
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{f.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.deckIds?.length || 0} sets • {f.visibility}</div>
                        </div>
                        {inClass ? <Check size={18} color="#2563eb" /> : <FolderPlus size={18} color="#64748b" />}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <button onClick={() => setShowAddFolderModal(false)} className="btn btn-primary">
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

