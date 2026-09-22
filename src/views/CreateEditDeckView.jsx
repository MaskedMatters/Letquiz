import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Trash2,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  FileText,
  Check,
  X
} from 'lucide-react';

export default function CreateEditDeckView() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { decks, createDeck, updateDeck, addToast, currentUser } = useApp();

  const existingDeck = decks.find((d) => d.id === deckId);
  const isEditing = !!existingDeck;

  const [title, setTitle] = useState(existingDeck?.title || '');
  const [description, setDescription] = useState(existingDeck?.description || '');
  const [category, setCategory] = useState(existingDeck?.category || 'Computer Science');
  const [visibility, setVisibility] = useState(existingDeck?.visibility || 'public');

  const [cards, setCards] = useState(
    existingDeck?.cards || [
      { id: 'c_' + Date.now() + '_1', term: '', definition: '', starred: false },
      { id: 'c_' + Date.now() + '_2', term: '', definition: '', starred: false }
    ]
  );

  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleAddCard = () => {
    setCards((prev) => [
      ...prev,
      { id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5), term: '', definition: '', starred: false }
    ]);
  };

  const handleRemoveCard = (index) => {
    if (cards.length <= 1) {
      addToast('A set must have at least one term', 'error');
      return;
    }
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (index, field, value) => {
    setCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSwapTermDef = (index) => {
    setCards((prev) => {
      const next = [...prev];
      const temp = next[index].term;
      next[index].term = next[index].definition;
      next[index].definition = temp;
      return next;
    });
  };

  const handleBulkImportSubmit = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n');
    const importedCards = [];

    lines.forEach((line) => {
      if (!line.trim()) return;
      let parts = line.split('\t');
      if (parts.length < 2) parts = line.split(',');
      if (parts.length >= 2) {
        importedCards.push({
          id: 'c_import_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          term: parts[0].trim(),
          definition: parts.slice(1).join(' ').trim(),
          starred: false
        });
      }
    });

    if (importedCards.length > 0) {
      setCards((prev) => [...prev.filter((c) => c.term.trim() || c.definition.trim()), ...importedCards]);
      addToast(`Imported ${importedCards.length} cards successfully!`, 'success');
      setBulkText('');
      setShowBulkImport(false);
    } else {
      addToast('Could not parse terms. Use Tab or Comma between terms and definitions.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please enter a set title', 'error');
      return;
    }

    const validCards = cards.filter((c) => c.term.trim() && c.definition.trim());
    if (validCards.length === 0) {
      addToast('Please provide at least one valid term and definition', 'error');
      return;
    }

    if (isEditing) {
      await updateDeck(existingDeck.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        visibility,
        cards: validCards
      });
      navigate(`/sets/${existingDeck.authorId || currentUser?.id || 'user'}/${existingDeck.id}`);
    } else {
      const res = await createDeck({
        title: title.trim(),
        description: description.trim(),
        category,
        visibility,
        cards: validCards
      });
      if (res) {
        navigate(`/sets/${res.authorId || currentUser?.id || 'user'}/${res.deckId}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div style={{ paddingBottom: 60, maxWidth: 900, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          {isEditing ? 'Edit Flashcard Set' : 'Create a New Flashcard Set'}
        </h1>

        <button onClick={handleSubmit} className="btn btn-primary">
          <Check size={18} />
          <span>{isEditing ? 'Save Changes' : 'Create Set'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Set Info Container */}
        <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Title *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder='Enter a title, e.g. "Data Structures & Algorithms"'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: '1.1rem', fontWeight: 600 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Category
              </label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Science">Science & Biology</option>
                <option value="Languages">Languages</option>
                <option value="History">History & Social Studies</option>
                <option value="Business">Business & Math</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Visibility Settings
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`btn ${visibility === 'public' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '8px 10px', fontSize: '0.82rem' }}
                >
                  <Eye size={14} /> Public
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('unlisted')}
                  className={`btn ${visibility === 'unlisted' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '8px 10px', fontSize: '0.82rem' }}
                >
                  <EyeOff size={14} /> Unlisted
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`btn ${visibility === 'private' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '8px 10px', fontSize: '0.82rem' }}
                >
                  <Lock size={14} /> Private
                </button>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
              Description
            </label>
            <textarea
              className="input-field"
              placeholder="Add a description of what this set covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Card Builder Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            Cards ({cards.length})
          </h2>

          <button
            type="button"
            onClick={() => setShowBulkImport(true)}
            className="btn btn-secondary btn-sm"
          >
            <FileText size={15} color="#2563eb" />
            <span>Bulk Import Text</span>
          </button>
        </div>

        {/* Cards Editor Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="glass-card"
              style={{ padding: 20, position: 'relative', background: '#ffffff' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: 8
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb' }}>
                  #{idx + 1}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleSwapTermDef(idx)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    title="Swap Term and Definition"
                  >
                    <ArrowLeftRight size={13} />
                    <span>Swap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveCard(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer'
                    }}
                    title="Remove card"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
                    TERM
                  </label>
                  <textarea
                    className="input-field"
                    placeholder="Enter term..."
                    value={card.term}
                    onChange={(e) => handleCardChange(idx, 'term', e.target.value)}
                    style={{ minHeight: 64 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
                    DEFINITION
                  </label>
                  <textarea
                    className="input-field"
                    placeholder="Enter definition..."
                    value={card.definition}
                    onChange={(e) => handleCardChange(idx, 'definition', e.target.value)}
                    style={{ minHeight: 64 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Card Button */}
        <button
          type="button"
          onClick={handleAddCard}
          className="btn btn-secondary"
          style={{ padding: 14, borderStyle: 'dashed', borderColor: '#cbd5e1' }}
        >
          <Plus size={18} color="#2563eb" />
          <span style={{ color: '#2563eb' }}>+ Add Card</span>
        </button>
      </form>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="modal-overlay" onClick={() => setShowBulkImport(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Bulk Import Cards</h3>
              <button onClick={() => setShowBulkImport(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12 }}>
              Paste tab-separated or comma-separated terms and definitions (one pair per line):
            </p>

            <textarea
              className="input-field"
              placeholder={`Term 1\tDefinition 1\nTerm 2\tDefinition 2`}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              style={{ minHeight: 180, fontFamily: 'monospace', fontSize: '0.88rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowBulkImport(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleBulkImportSubmit} className="btn btn-primary">
                Import Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
