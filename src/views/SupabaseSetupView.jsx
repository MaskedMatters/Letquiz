import React, { useState } from 'react';
import { Database, Key, Check, Copy, Code } from 'lucide-react';

export default function SupabaseSetupView() {
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envTemplate = `VITE_SUPABASE_URL=https://rrfldgvrjjayxdaboqby.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Mh6CbQlFOH3g5-NnkRL2bQ_u5j6y3-U`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 3000);
  };

  return (
    <div style={{ maxWidth: 840, margin: '40px auto', paddingBottom: 60 }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: 36,
          marginBottom: 32,
          borderLeft: '4px solid #2563eb'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={24} color="#2563eb" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Connect Letquiz to Supabase</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Letquiz strictly requires your Supabase Project URL and modern Publishable Key.
            </p>
          </div>
        </div>
      </div>

      {/* Tutorial Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Step 1: Environment Variables */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              1
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Set Up Environment Variables (.env.local)</h3>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 14, lineHeight: 1.5 }}>
            Open your <code>.env.local</code> file at <code>/home/maskedmatters/Documents/Letquiz/.env.local</code> and save your Supabase URL and Publishable Key (<code>VITE_SUPABASE_PUBLISHABLE_KEY</code>):
          </p>

          <div style={{ position: 'relative', marginBottom: 14 }}>
            <pre
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: 16,
                borderRadius: 8,
                fontSize: '0.88rem',
                fontFamily: 'monospace',
                overflowX: 'auto'
              }}
            >
              {envTemplate}
            </pre>
            <button
              onClick={handleCopyEnv}
              className="btn btn-secondary btn-sm"
              style={{ position: 'absolute', right: 12, top: 12, background: '#1e293b', borderColor: '#334155', color: '#fff' }}
            >
              {copiedEnv ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedEnv ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>
        </div>

        {/* Step 2: Database DDL Execution & RLS */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              2
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Run PostgreSQL DDL in Supabase SQL Editor</h3>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 14, lineHeight: 1.5 }}>
            Open the Supabase SQL Editor and execute the schema file at <code>sql/01_schema.sql</code>. It creates all tables and configures Row Level Security (RLS) policies and API permissions.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div><Code size={16} color="#2563eb" style={{ display: 'inline', marginRight: 6 }} /><strong>Schema Setup:</strong> <code>file:///home/maskedmatters/Documents/Letquiz/sql/01_schema.sql</code></div>
            <div><Code size={16} color="#dc2626" style={{ display: 'inline', marginRight: 6 }} /><strong>Data Reset / Wipe:</strong> <code>file:///home/maskedmatters/Documents/Letquiz/sql/02_reset_database.sql</code></div>
          </div>
        </div>

        {/* Step 3: Auth Providers */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              3
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Enable Authentication Providers</h3>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 14, lineHeight: 1.5 }}>
            In your Supabase Dashboard under <strong>Authentication &gt; Providers</strong>:
          </p>

          <ul style={{ paddingLeft: 24, color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li><strong>Email</strong>: Turn on Email/Password sign up and verification.</li>
            <li><strong>Google</strong>: Turn on Google OAuth and enter your Client ID & Secret.</li>
            <li><strong>GitHub</strong>: Turn on GitHub OAuth and enter your Client ID & Secret.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
