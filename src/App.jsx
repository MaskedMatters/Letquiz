import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { isSupabaseConfigured } from './lib/supabase';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import ShareModal from './components/ShareModal';
import FolderModal from './components/FolderModal';
import ClassModal from './components/ClassModal';
import JoinClassModal from './components/JoinClassModal';
import AuthModal from './components/AuthModal';

import SupabaseSetupView from './views/SupabaseSetupView';
import LandingView from './views/LandingView';
import HomeView from './views/HomeView';
import DeckDetailView from './views/DeckDetailView';
import CreateEditDeckView from './views/CreateEditDeckView';
import FlashcardStudyView from './views/FlashcardStudyView';
import TestGeneratorView from './views/TestGeneratorView';
import FolderDetailView from './views/FolderDetailView';
import ClassDetailView from './views/ClassDetailView';
import ExploreView from './views/ExploreView';
import ProfileView from './views/ProfileView';

export default function App() {
  const { currentUser } = useApp();

  // Modal States
  const [shareModalItem, setShareModalItem] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinInitialCode, setJoinInitialCode] = useState('');
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'register' | null

  const handleOpenShare = (type, item) => {
    setShareModalItem({ type, item });
  };

  const handleOpenFolderModal = (folder = null) => {
    if (!currentUser) {
      setAuthModalMode('login');
      return;
    }
    setFolderToEdit(folder);
    setShowFolderModal(true);
  };

  const handleOpenJoinModal = (code = '') => {
    if (!currentUser) {
      setAuthModalMode('login');
      return;
    }
    setJoinInitialCode(code);
    setShowJoinModal(true);
  };

  const handleOpenClassModal = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      return;
    }
    setShowClassModal(true);
  };

  // If Supabase environment variables are missing, render the Setup Guide
  if (!isSupabaseConfigured) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            Letquiz <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: 4 }}>Supabase Setup Required</span>
          </div>
        </header>
        <main style={{ flex: 1, padding: '24px' }}>
          <SupabaseSetupView />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onOpenJoinClassModal={() => handleOpenJoinModal()}
        onOpenFolderModal={() => handleOpenFolderModal()}
        onOpenClassModal={handleOpenClassModal}
      />

      <main style={{ flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '24px 24px 60px' }}>
        <Routes>
          {/* Home / Landing */}
          <Route
            path="/"
            element={
              !currentUser ? (
                <LandingView onOpenAuth={(mode) => setAuthModalMode(mode)} />
              ) : (
                <HomeView
                  onOpenShare={handleOpenShare}
                  onOpenFolderModal={() => handleOpenFolderModal()}
                  onOpenClassModal={handleOpenClassModal}
                  onOpenJoinModal={handleOpenJoinModal}
                />
              )
            }
          />

          {/* Explore Route */}
          <Route
            path="/explore"
            element={
              <ExploreView
                onOpenShare={handleOpenShare}
                onOpenJoinModal={handleOpenJoinModal}
              />
            }
          />

          {/* Create & Edit Set Routes - MUST be declared before /sets/:deckId */}
          <Route path="/sets/create" element={<CreateEditDeckView />} />
          <Route path="/create-set" element={<CreateEditDeckView />} />
          <Route path="/edit-set/:deckId" element={<CreateEditDeckView />} />

          {/* Deck Detail Routes */}
          <Route
            path="/sets/:userId/:deckId"
            element={<DeckDetailView onOpenShare={handleOpenShare} />}
          />
          <Route
            path="/sets/:deckId"
            element={<DeckDetailView onOpenShare={handleOpenShare} />}
          />

          {/* Flashcard Study Routes */}
          <Route
            path="/flashcards/:userId/:deckId"
            element={<FlashcardStudyView />}
          />
          <Route
            path="/flashcards/:deckId"
            element={<FlashcardStudyView />}
          />

          {/* Practice Test Routes */}
          <Route
            path="/test/:userId/:deckId"
            element={<TestGeneratorView />}
          />
          <Route
            path="/test/:deckId"
            element={<TestGeneratorView />}
          />

          {/* Folder Routes */}
          <Route
            path="/folders/:userId/:folderId"
            element={
              <FolderDetailView
                onOpenShare={handleOpenShare}
                onOpenEditFolder={handleOpenFolderModal}
              />
            }
          />
          <Route
            path="/folders/:folderId"
            element={
              <FolderDetailView
                onOpenShare={handleOpenShare}
                onOpenEditFolder={handleOpenFolderModal}
              />
            }
          />

          {/* Class Routes */}
          <Route
            path="/classes/:classId"
            element={<ClassDetailView onOpenShare={handleOpenShare} />}
          />

          {/* Profile Route */}
          <Route
            path="/profile/:userId"
            element={
              <ProfileView
                onOpenShare={handleOpenShare}
                onOpenJoinModal={handleOpenJoinModal}
              />
            }
          />

          {/* Fallback redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {shareModalItem && (
        <ShareModal
          type={shareModalItem.type}
          item={shareModalItem.item}
          onClose={() => setShareModalItem(null)}
        />
      )}

      {showFolderModal && (
        <FolderModal
          folderToEdit={folderToEdit}
          onClose={() => {
            setShowFolderModal(false);
            setFolderToEdit(null);
          }}
        />
      )}

      {showClassModal && (
        <ClassModal onClose={() => setShowClassModal(false)} />
      )}

      {showJoinModal && (
        <JoinClassModal
          initialCode={joinInitialCode}
          onClose={() => {
            setShowJoinModal(false);
            setJoinInitialCode('');
          }}
        />
      )}

      <ToastContainer />
    </div>
  );
}

