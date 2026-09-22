import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Auth & User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('letquiz_current_user_obj');
    return saved ? JSON.parse(saved) : null;
  });

  // App Data State (Fetched live from Supabase)
  const [users, setUsers] = useState([]);
  const [decks, setDecks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [classes, setClasses] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync session state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('letquiz_current_user_obj', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('letquiz_current_user_obj');
    }
  }, [currentUser]);

  // Load Data from Supabase
  const loadSupabaseData = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);
    try {
      // 1. Fetch Profiles
      const { data: profilesData } = await supabase.from('profiles').select('*');
      if (profilesData) {
        setUsers(
          profilesData.map((p) => ({
            id: p.id,
            username: p.username,
            name: p.full_name || p.username,
            avatar: p.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${p.username}`,
            bio: p.bio,
            streak: p.streak || 1,
            cardsMastered: p.cards_mastered || 0,
            testsCompleted: p.tests_completed || 0
          }))
        );
      }

      // 2. Fetch Decks & Cards
      const { data: decksData } = await supabase.from('decks').select('*, cards(*)');
      if (decksData) {
        setDecks(
          decksData.map((d) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            category: d.category,
            visibility: d.visibility,
            authorId: d.author_id,
            createdAt: d.created_at ? d.created_at.split('T')[0] : '2026-09-21',
            viewCount: d.view_count || 1,
            cards: (d.cards || []).map((c) => ({
              id: c.id,
              term: c.term,
              definition: c.definition,
              starred: c.starred
            })),
            forkedFrom: d.forked_from_id ? {
              id: d.forked_from_id,
              authorName: d.forked_from_author_name || 'Creator',
              title: d.forked_from_title || 'Original Set'
            } : null
          }))
        );
      }

      // 3. Fetch Folders & Junctions
      const { data: foldersData } = await supabase.from('folders').select('*, folder_decks(deck_id)');
      if (foldersData) {
        setFolders(
          foldersData.map((f) => ({
            id: f.id,
            title: f.title,
            description: f.description,
            color: f.color,
            visibility: f.visibility,
            ownerId: f.owner_id,
            deckIds: (f.folder_decks || []).map((fd) => fd.deck_id),
            createdAt: f.created_at ? f.created_at.split('T')[0] : '2026-09-21',
            forkedFrom: f.forked_from_id ? {
              id: f.forked_from_id,
              ownerName: f.forked_from_owner_name || 'Creator',
              title: f.forked_from_title || 'Original Folder'
            } : null
          }))
        );
      }

      // 4. Fetch Classes, Roster, Folders, & Announcements
      const { data: classesData } = await supabase
        .from('classes')
        .select('*, class_members(user_id), class_folders(folder_id), announcements(*)');
      if (classesData) {
        setClasses(
          classesData.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            category: c.category,
            bannerColor: c.banner_color,
            isInviteOnly: c.is_invite_only,
            inviteCode: c.invite_code,
            ownerId: c.owner_id,
            memberIds: (c.class_members || []).map((cm) => cm.user_id),
            folderIds: (c.class_folders || []).map((cf) => cf.folder_id),
            announcements: (c.announcements || []).map((a) => {
              const author = (profilesData || []).find((p) => p.id === a.author_id);
              return {
                id: a.id,
                authorId: a.author_id,
                authorName: author ? (author.full_name || author.username || 'Member') : 'Member',
                authorAvatar: author?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${a.author_id}`,
                title: a.title,
                body: a.body,
                createdAt: a.created_at ? a.created_at.split('T')[0] : 'Recently'
              };
            })
          }))
        );
      }

      // 5. Fetch Test Results
      const { data: resultsData } = await supabase.from('test_results').select('*');
      if (resultsData) {
        setTestResults(resultsData);
      }
    } catch (err) {
      console.error('Supabase load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listen to Supabase Auth Changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    loadSupabaseData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSupabaseUser = async (sbUser) => {
    const avatarUrl =
      sbUser.user_metadata?.avatar_url ||
      sbUser.user_metadata?.picture ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${sbUser.email}`;

    const userObj = {
      id: sbUser.id,
      email: sbUser.email,
      name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
      username: sbUser.email?.split('@')[0] || 'user',
      avatar: avatarUrl,
      role: 'Student',
      streak: 1,
      cardsMastered: 0,
      testsCompleted: 0,
      identities: sbUser.identities || [],
      provider: sbUser.app_metadata?.provider || 'email'
    };

    setCurrentUser(userObj);

    if (supabase) {
      await supabase.from('profiles').upsert(
        {
          id: userObj.id,
          username: userObj.username,
          full_name: userObj.name,
          avatar_url: userObj.avatar
        },
        { onConflict: 'id' }
      );
    }
  };

  // Auth Providers
  const loginWithProvider = async (provider) => {
    if (!isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      if (error.message.includes('not enabled') || error.message.includes('Unsupported provider') || error.status === 400) {
        addToast(`The ${provider.toUpperCase()} provider is not enabled in your Supabase Dashboard under Authentication > Providers.`, 'error');
      } else {
        addToast(error.message, 'error');
      }
    }
  };

  const loginWithEmail = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      addToast(error.message, 'error');
      return false;
    }
    if (data.user) {
      await handleSupabaseUser(data.user);
      addToast('Signed in successfully!', 'success');
    }
    return true;
  };

  const registerWithEmail = async (email, password, name) => {
    if (!isSupabaseConfigured || !supabase) return { success: false };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) {
      addToast(error.message, 'error');
      return { success: false };
    }
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    addToast('Logged out', 'info');
  };

  // Create Deck
  const createDeck = async (deckData) => {
    if (!currentUser) {
      addToast('Please sign in to create a flashcard set', 'error');
      return null;
    }

    const localDeckId = 'deck_' + Date.now();
    const newDeck = {
      id: localDeckId,
      ...deckData,
      authorId: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
      viewCount: 1,
      cards: deckData.cards || []
    };

    setDecks((prev) => [newDeck, ...prev]);
    addToast(`Set "${newDeck.title}" created!`, 'success');

    if (isSupabaseConfigured && supabase) {
      const { data: deckRes, error: deckErr } = await supabase
        .from('decks')
        .insert({
          author_id: currentUser.id,
          title: deckData.title,
          description: deckData.description || '',
          category: deckData.category || 'General',
          visibility: deckData.visibility || 'public'
        })
        .select()
        .single();

      if (deckErr) {
        console.error('Deck insert error:', deckErr);
        return { deckId: localDeckId, authorId: currentUser.id };
      }

      if (deckRes && deckData.cards && deckData.cards.length > 0) {
        const cardsToInsert = deckData.cards.map((c, idx) => ({
          deck_id: deckRes.id,
          term: c.term,
          definition: c.definition,
          starred: !!c.starred,
          order_index: idx
        }));
        await supabase.from('cards').insert(cardsToInsert);
      }
      loadSupabaseData();
      return { deckId: deckRes.id, authorId: currentUser.id };
    }
    return { deckId: localDeckId, authorId: currentUser.id };
  };

  const updateDeck = async (deckId, updatedData) => {
    setDecks((prev) =>
      prev.map((d) => (d.id === deckId ? { ...d, ...updatedData } : d))
    );
    addToast('Set updated', 'success');

    if (isSupabaseConfigured && supabase && !deckId.startsWith('deck_')) {
      await supabase.from('decks').update({
        title: updatedData.title,
        description: updatedData.description,
        category: updatedData.category,
        visibility: updatedData.visibility
      }).eq('id', deckId);
    }
  };

  const deleteDeck = async (deckId) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
    setFolders((prev) =>
      prev.map((f) => ({ ...f, deckIds: f.deckIds.filter((id) => id !== deckId) }))
    );
    addToast('Set deleted', 'info');

    if (isSupabaseConfigured && supabase && !deckId.startsWith('deck_')) {
      await supabase.from('decks').delete().eq('id', deckId);
    }
  };

  const toggleStarCard = async (deckId, cardId) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id !== deckId) return d;
        return {
          ...d,
          cards: d.cards.map((c) =>
            c.id === cardId ? { ...c, starred: !c.starred } : c
          )
        };
      })
    );

    if (isSupabaseConfigured && supabase && !cardId.startsWith('c_')) {
      const targetDeck = decks.find((d) => d.id === deckId);
      const targetCard = targetDeck?.cards?.find((c) => c.id === cardId);
      if (targetCard) {
        await supabase.from('cards').update({ starred: !targetCard.starred }).eq('id', cardId);
      }
    }
  };

  const createFolder = async (folderData) => {
    if (!currentUser) return null;
    const localId = 'folder_' + Date.now();
    const newFolder = {
      id: localId,
      title: folderData.title,
      description: folderData.description || '',
      color: folderData.color || '#2563eb',
      visibility: folderData.visibility || 'public',
      ownerId: currentUser.id,
      deckIds: folderData.deckIds || [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFolders((prev) => [newFolder, ...prev]);
    addToast(`Folder "${newFolder.title}" created!`, 'success');

    if (isSupabaseConfigured && supabase) {
      const { data: fRes, error: fErr } = await supabase.from('folders').insert({
        owner_id: currentUser.id,
        title: folderData.title,
        description: folderData.description || '',
        color: folderData.color || '#2563eb',
        visibility: folderData.visibility || 'public'
      }).select().single();

      if (!fErr && fRes && folderData.deckIds?.length > 0) {
        const folderDecks = folderData.deckIds
          .filter((dId) => !dId.startsWith('deck_'))
          .map((dId) => ({ folder_id: fRes.id, deck_id: dId }));
        if (folderDecks.length > 0) {
          await supabase.from('folder_decks').insert(folderDecks);
        }
      }
      loadSupabaseData();
      return { folderId: fRes?.id || localId, ownerId: currentUser.id };
    }
    return { folderId: localId, ownerId: currentUser.id };
  };

  const updateFolder = async (folderId, updatedData) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, ...updatedData } : f))
    );
    addToast('Folder updated', 'success');

    if (isSupabaseConfigured && supabase && !folderId.startsWith('folder_')) {
      await supabase.from('folders').update({
        title: updatedData.title,
        description: updatedData.description,
        color: updatedData.color,
        visibility: updatedData.visibility
      }).eq('id', folderId);
    }
  };

  const deleteFolder = async (folderId) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    addToast('Folder deleted', 'info');

    if (isSupabaseConfigured && supabase && !folderId.startsWith('folder_')) {
      await supabase.from('folders').delete().eq('id', folderId);
    }
  };

  const toggleDeckInFolder = (folderId, deckId) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        const exists = f.deckIds.includes(deckId);
        const newDeckIds = exists
          ? f.deckIds.filter((id) => id !== deckId)
          : [...f.deckIds, deckId];
        return { ...f, deckIds: newDeckIds };
      })
    );
    addToast('Folder updated', 'info');
  };

  const createClass = async (classData) => {
    if (!currentUser) return null;
    const localId = 'class_' + Date.now();
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newClass = {
      id: localId,
      title: classData.title,
      description: classData.description || '',
      category: classData.category || 'General',
      bannerColor: classData.bannerColor || '#2563eb',
      isInviteOnly: !!classData.isInviteOnly,
      inviteCode,
      ownerId: currentUser.id,
      memberIds: [currentUser.id],
      folderIds: classData.folderIds || [],
      announcements: []
    };

    setClasses((prev) => [newClass, ...prev]);
    addToast(`Class "${newClass.title}" created!`, 'success');

    if (isSupabaseConfigured && supabase) {
      const { data: cRes, error: cErr } = await supabase.from('classes').insert({
        owner_id: currentUser.id,
        title: classData.title,
        description: classData.description || '',
        category: classData.category || 'General',
        banner_color: classData.bannerColor || '#2563eb',
        is_invite_only: !!classData.isInviteOnly,
        invite_code: inviteCode
      }).select().single();

      if (!cErr && cRes) {
        await supabase.from('class_members').insert({ class_id: cRes.id, user_id: currentUser.id });
      }
      loadSupabaseData();
      return { classId: cRes?.id || localId };
    }
    return { classId: localId };
  };

  const joinClassWithInviteCode = async (code) => {
    if (!currentUser) return null;
    const cleanCode = code.trim().toUpperCase();
    const targetClass = classes.find((c) => c.inviteCode === cleanCode);

    if (!targetClass) {
      addToast('Invalid invite code. Ensure the class owner generated this code.', 'error');
      return null;
    }

    if (targetClass.memberIds.includes(currentUser.id)) {
      addToast(`Already a member of ${targetClass.title}`, 'info');
      return targetClass.id;
    }

    setClasses((prev) =>
      prev.map((c) =>
        c.id === targetClass.id
          ? { ...c, memberIds: [...c.memberIds, currentUser.id] }
          : c
      )
    );
    addToast(`Joined "${targetClass.title}"!`, 'success');

    if (isSupabaseConfigured && supabase && !targetClass.id.startsWith('class_')) {
      await supabase.from('class_members').insert({ class_id: targetClass.id, user_id: currentUser.id });
    }
    return targetClass.id;
  };

  const joinPublicClass = async (classId) => {
    if (!currentUser) return;
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        if (c.memberIds.includes(currentUser.id)) return c;
        return { ...c, memberIds: [...c.memberIds, currentUser.id] };
      })
    );
    addToast('Joined class', 'success');

    if (isSupabaseConfigured && supabase && !classId.startsWith('class_')) {
      await supabase.from('class_members').insert({ class_id: classId, user_id: currentUser.id });
    }
  };

  const deleteClass = async (classId) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    if (isSupabaseConfigured && supabase && !classId.startsWith('class_')) {
      await supabase.from('classes').delete().eq('id', classId);
    }
  };

  const leaveClass = async (classId) => {
    if (!currentUser) return;
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;

    const isOwnerLeaving = currentUser.id === cls.ownerId;
    const remainingMembers = (cls.memberIds || []).filter((id) => id !== currentUser.id);

    if (isOwnerLeaving || remainingMembers.length === 0) {
      await deleteClass(classId);
      addToast(`Class "${cls.title}" was deleted because the admin left or it had no remaining members.`, 'info');
    } else {
      setClasses((prev) =>
        prev.map((c) => {
          if (c.id !== classId) return c;
          return { ...c, memberIds: remainingMembers };
        })
      );
      addToast('Left class', 'info');

      if (isSupabaseConfigured && supabase && !classId.startsWith('class_')) {
        await supabase.from('class_members').delete().eq('class_id', classId).eq('user_id', currentUser.id);
      }
    }
  };

  const duplicateDeck = async (deckId) => {
    if (!currentUser) {
      addToast('Please sign in to duplicate flashcard sets', 'error');
      return null;
    }
    const sourceDeck = decks.find((d) => d.id === deckId);
    if (!sourceDeck) return null;

    const author = users.find((u) => u.id === sourceDeck.authorId) || { name: 'User' };

    const newDeckId = isSupabaseConfigured ? crypto.randomUUID() : 'deck_' + Date.now();
    const newDeck = {
      id: newDeckId,
      authorId: currentUser.id,
      title: sourceDeck.title + ' (Copy)',
      description: sourceDeck.description || '',
      category: sourceDeck.category || 'General',
      visibility: 'public',
      viewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      cards: (sourceDeck.cards || []).map((c, idx) => ({
        id: isSupabaseConfigured ? crypto.randomUUID() : `card_${Date.now()}_${idx}`,
        term: c.term,
        definition: c.definition,
        starred: false,
        orderIndex: idx
      })),
      forkedFrom: {
        id: sourceDeck.id,
        authorId: sourceDeck.authorId,
        authorName: author.name,
        title: sourceDeck.title
      }
    };

    setDecks((prev) => [newDeck, ...prev]);
    addToast(`Duplicated "${sourceDeck.title}" to your library!`, 'success');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('decks')
        .insert({
          id: newDeckId,
          author_id: currentUser.id,
          title: newDeck.title,
          description: newDeck.description,
          category: newDeck.category,
          visibility: newDeck.visibility,
          forked_from_id: sourceDeck.id,
          forked_from_author_name: author.name,
          forked_from_title: sourceDeck.title
        });

      if (!error && newDeck.cards.length > 0) {
        await supabase.from('cards').insert(
          newDeck.cards.map((c) => ({
            id: c.id,
            deck_id: newDeckId,
            term: c.term,
            definition: c.definition,
            order_index: c.orderIndex
          }))
        );
      }
    }

    return newDeckId;
  };

  const duplicateFolder = async (folderId) => {
    if (!currentUser) {
      addToast('Please sign in to duplicate folders', 'error');
      return null;
    }
    const sourceFolder = folders.find((f) => f.id === folderId);
    if (!sourceFolder) return null;

    const owner = users.find((u) => u.id === sourceFolder.ownerId) || { name: 'User' };

    // Duplicate decks contained in folder
    const folderDecks = decks.filter((d) => (sourceFolder.deckIds || []).includes(d.id));
    const newDeckIds = [];
    for (const d of folderDecks) {
      const newId = await duplicateDeck(d.id);
      if (newId) newDeckIds.push(newId);
    }

    const newFolderId = isSupabaseConfigured ? crypto.randomUUID() : 'folder_' + Date.now();
    const newFolder = {
      id: newFolderId,
      ownerId: currentUser.id,
      title: sourceFolder.title + ' (Copy)',
      description: sourceFolder.description || '',
      color: sourceFolder.color || '#2563eb',
      visibility: 'public',
      deckIds: newDeckIds,
      createdAt: new Date().toISOString().split('T')[0],
      forkedFrom: {
        id: sourceFolder.id,
        ownerId: sourceFolder.ownerId,
        ownerName: owner.name,
        title: sourceFolder.title
      }
    };

    setFolders((prev) => [newFolder, ...prev]);
    addToast(`Duplicated folder "${sourceFolder.title}" and its sets!`, 'success');

    if (isSupabaseConfigured && supabase) {
      await supabase.from('folders').insert({
        id: newFolderId,
        owner_id: currentUser.id,
        title: newFolder.title,
        description: newFolder.description,
        color: newFolder.color,
        visibility: newFolder.visibility,
        forked_from_id: sourceFolder.id,
        forked_from_owner_name: owner.name,
        forked_from_title: sourceFolder.title
      });

      if (newDeckIds.length > 0) {
        await supabase.from('folder_decks').insert(
          newDeckIds.map((deckId) => ({ folder_id: newFolderId, deck_id: deckId }))
        );
      }
    }

    return newFolderId;
  };

  const addFolderToClass = async (classId, folderId) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        if (c.folderIds.includes(folderId)) return c;
        return { ...c, folderIds: [...c.folderIds, folderId] };
      })
    );
    addToast('Folder added to class', 'success');

    if (isSupabaseConfigured && supabase && !classId.startsWith('class_') && !folderId.startsWith('folder_')) {
      await supabase.from('class_folders').insert({ class_id: classId, folder_id: folderId });
    }
  };

  const postAnnouncement = async (classId, title, body) => {
    if (!currentUser) return;
    const newAnnouncement = {
      id: 'a_' + Date.now(),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      title,
      body,
      createdAt: 'Just now'
    };
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, announcements: [newAnnouncement, ...(c.announcements || [])] }
          : c
      )
    );
    addToast('Announcement posted', 'success');

    if (isSupabaseConfigured && supabase && !classId.startsWith('class_')) {
      await supabase.from('announcements').insert({
        class_id: classId,
        author_id: currentUser.id,
        title,
        body
      });
    }
  };

  const recordTestResult = async (resultData) => {
    if (!currentUser) return;
    const newRecord = {
      id: 'res_' + Date.now(),
      userId: currentUser.id,
      date: new Date().toISOString(),
      ...resultData
    };
    setTestResults((prev) => [newRecord, ...prev]);

    if (isSupabaseConfigured && supabase && resultData.deckId && !resultData.deckId.startsWith('deck_')) {
      await supabase.from('test_results').insert({
        user_id: currentUser.id,
        deck_id: resultData.deckId,
        score: resultData.score,
        correct_count: resultData.correctCount,
        total_questions: resultData.totalQuestions
      });
    }
  };

  const updateUserBio = async (newBio) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, bio: newBio };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, bio: newBio } : u))
    );
    addToast('Bio updated successfully', 'success');

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('profiles')
        .update({ bio: newBio })
        .eq('id', currentUser.id);
    }
  };

  const updateUserEmail = async (newEmail) => {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      addToast(error.message, 'error');
      return false;
    }
    addToast('Confirmation link sent to new email address! Please check your inbox.', 'info');
    return true;
  };

  const updateUserPassword = async (newPassword) => {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      addToast(error.message, 'error');
      return false;
    }
    addToast('Password updated successfully!', 'success');
    return true;
  };

  const unlinkProvider = async (identity) => {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) {
      addToast(error.message, 'error');
      return false;
    }
    addToast(`Disconnected ${identity.provider} provider`, 'info');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) handleSupabaseUser(session.user);
    return true;
  };

  const deleteAccount = async () => {
    if (!currentUser) return false;
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').delete().eq('id', currentUser.id);
        await supabase.auth.signOut();
      }
      setCurrentUser(null);
      addToast('Your account has been deleted.', 'info');
      return true;
    } catch (err) {
      addToast('Failed to delete account. Please try again.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        updateUserBio,
        updateUserEmail,
        updateUserPassword,
        unlinkProvider,
        deleteAccount,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithProvider,
        logout,
        decks,
        createDeck,
        updateDeck,
        deleteDeck,
        duplicateDeck,
        toggleStarCard,
        folders,
        createFolder,
        updateFolder,
        deleteFolder,
        duplicateFolder,
        toggleDeckInFolder,
        classes,
        createClass,
        deleteClass,
        joinClassWithInviteCode,
        joinPublicClass,
        leaveClass,
        addFolderToClass,
        postAnnouncement,
        testResults,
        recordTestResult,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
