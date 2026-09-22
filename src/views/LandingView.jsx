import React from 'react';
import { BookOpen, Layers, FolderCheck, Users, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingView({ onOpenAuth }) {
  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '60px 0 40px',
          textAlign: 'center',
          maxWidth: 800,
          margin: '0 auto'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 999, padding: '4px 12px', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 20 }}>
          <span>Simple, Modern Flashcard Learning Platform</span>
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 18, color: '#0f172a' }}>
          Master any subject with custom flashcards and practice tests
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.6, marginBottom: 32 }}>
          Letquiz helps students and educators build study sets, organize unlisted folders, generate custom practice exams, and collaborate in invite-only classes.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button onClick={() => onOpenAuth('register')} className="btn btn-primary btn-lg">
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>

          <button onClick={() => onOpenAuth('login')} className="btn btn-secondary btn-lg">
            <span>Log In</span>
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 40 }}>
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <BookOpen size={22} color="#2563eb" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Flashcard Sets</h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Create terms and definitions with 3D flip card views, audio text-to-speech pronunciations, and star flagging for focused review.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Layers size={22} color="#16a34a" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Practice Test Generator</h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Generate custom practice exams with flexible question counts, multiple choice options, true/false checks, and written recall.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <FolderCheck size={22} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Public & Unlisted Folders</h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Group multiple sets into public collections or secret unlisted links accessible only to those with the exact link.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Users size={22} color="#7c3aed" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Invite-Only Classes</h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Create study communities secured by unique 6-character access codes to share folders and announcements with members.
          </p>
        </div>
      </section>
    </div>
  );
}
