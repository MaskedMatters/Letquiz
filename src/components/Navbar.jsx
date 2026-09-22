import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Search,
  Plus,
  FolderPlus,
  Users,
  BookOpen,
  ChevronDown,
  KeyRound,
  Compass,
  Home,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenJoinClassModal, onOpenFolderModal, onOpenClassModal }) {
  const {
    currentUser,
    logout,
    searchQuery,
    setSearchQuery
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const createMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setShowCreateMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navBtnStyle = {
    height: 38,
    padding: '0 14px',
    fontSize: '0.88rem',
    borderRadius: 6,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 24px',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)'
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            userSelect: 'none'
          }}
        >
          <img
            src="/logo.png"
            alt="Letquiz"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              objectFit: 'cover'
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}
          >
            Letquiz
          </span>
        </Link>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            maxWidth: 440,
            position: 'relative'
          }}
        >
          <Search
            size={17}
            color="#64748b"
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search sets, folders, classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (location.pathname !== '/explore') navigate('/explore');
            }}
            style={{
              paddingLeft: 38,
              height: 38,
              fontSize: '0.88rem',
              borderRadius: 6,
              background: '#f8fafc',
              borderColor: '#e2e8f0'
            }}
          />
        </form>

        {/* Navigation & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            to="/"
            className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`}
            style={navBtnStyle}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>

          <Link
            to="/explore"
            className={`btn ${location.pathname.startsWith('/explore') ? 'btn-primary' : 'btn-secondary'}`}
            style={navBtnStyle}
          >
            <Compass size={16} />
            <span>Explore</span>
          </Link>

          {currentUser ? (
            <>
              <button
                onClick={onOpenJoinClassModal}
                className="btn btn-secondary"
                style={{ ...navBtnStyle, color: '#6d28d9' }}
              >
                <KeyRound size={16} />
                <span>Join Class</span>
              </button>

              {/* Create Menu Dropdown */}
              <div style={{ position: 'relative' }} ref={createMenuRef}>
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="btn btn-primary"
                  style={navBtnStyle}
                >
                  <Plus size={16} />
                  <span>Create</span>
                  <ChevronDown size={14} />
                </button>

                {showCreateMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '115%',
                      width: 200,
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      padding: 6,
                      zIndex: 100
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowCreateMenu(false);
                        navigate('/sets/create');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: '#0f172a',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.86rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <BookOpen size={16} color="#2563eb" />
                      <span>Flashcard Set</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowCreateMenu(false);
                        onOpenFolderModal();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: '#0f172a',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.86rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <FolderPlus size={16} color="#0d9488" />
                      <span>Folder</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowCreateMenu(false);
                        onOpenClassModal();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: '#0f172a',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.86rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <Users size={16} color="#7c3aed" />
                      <span>Study Class</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Menu Dropdown */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="btn btn-secondary"
                  style={{ ...navBtnStyle, padding: '0 10px 0 6px' }}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '115%',
                      width: 200,
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      padding: 6,
                      zIndex: 100
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate(`/profile/${currentUser.id}`);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: '#0f172a',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.86rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <User size={16} color="#2563eb" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.86rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onOpenAuth('login')} className="btn btn-secondary" style={navBtnStyle}>
                Log In
              </button>
              <button onClick={() => onOpenAuth('register')} className="btn btn-primary" style={navBtnStyle}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
