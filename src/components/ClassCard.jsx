import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Folder, KeyRound, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export default function ClassCard({ cls, onOpenJoinModal }) {
  const { currentUser, joinPublicClass } = useApp();
  const isMember = currentUser && cls.memberIds?.includes(currentUser.id);
  const classUrl = `/classes/${cls.id}`;

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 210,
        background: '#ffffff'
      }}
    >
      {/* Banner Top */}
      <div
        style={{
          background: cls.bannerColor || '#2563eb',
          padding: '16px 20px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '0.04em'
            }}
          >
            {cls.category || 'Classroom'}
          </span>

          {cls.isInviteOnly ? (
            <span className="badge badge-invite">
              <KeyRound size={12} /> Invite Only
            </span>
          ) : (
            <span className="badge badge-public">
              <Globe size={12} /> Public Class
            </span>
          )}
        </div>

        <Link
          to={classUrl}
          style={{
            textDecoration: 'none',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#ffffff',
            marginTop: 8,
            display: 'block',
            lineHeight: 1.3
          }}
        >
          {cls.title}
        </Link>
      </div>

      {/* Body Info */}
      <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p
          style={{
            fontSize: '0.86rem',
            color: '#64748b',
            lineHeight: 1.4,
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {cls.description || 'Study classroom hub.'}
        </p>

        {/* Stats & Action */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              fontSize: '0.82rem',
              color: '#475569'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={15} color="#2563eb" />
              <span>{cls.memberIds?.length || 0} members</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Folder size={15} color="#0d9488" />
              <span>{cls.folderIds?.length || 0} shared folders</span>
            </div>
          </div>

          {isMember ? (
            <Link
              to={classUrl}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', color: '#2563eb', textDecoration: 'none' }}
            >
              <ShieldCheck size={15} />
              <span>Joined Hub</span>
              <ArrowRight size={14} />
            </Link>
          ) : cls.isInviteOnly ? (
            <button
              onClick={() => onOpenJoinModal(cls.inviteCode)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              <KeyRound size={15} />
              <span>Enter Invite Code</span>
            </button>
          ) : (
            <button
              onClick={() => joinPublicClass(cls.id)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              <Users size={15} />
              <span>Join Class</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
