import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export default function TestGeneratorView() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { decks, recordTestResult } = useApp();

  const deck = decks.find((d) => d.id === deckId);
  const cards = deck?.cards || [];

  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  // Configuration
  const [questionCount, setQuestionCount] = useState(Math.min(5, cards.length));
  const [testMode, setTestMode] = useState('definitions');

  // Test State
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(0);

  if (!deck || cards.length < 2) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', marginTop: 40 }}>
        <h2>At Least 2 Cards Required to Generate a Practice Test</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          Please add more cards to this set before taking a practice test.
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Back to Set
        </button>
      </div>
    );
  }

  const generateQuestions = () => {
    const shuffledCards = [...cards].sort(() => 0.5 - Math.random());
    const subset = shuffledCards.slice(0, questionCount);

    const generated = subset.map((card, idx) => {
      if (testMode === 'definitions') {
        const otherCards = cards.filter((c) => c.id !== card.id);
        const distractors = [...otherCards]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((c) => c.definition);

        const options = [...distractors, card.definition].sort(() => 0.5 - Math.random());

        return {
          id: 'q_' + idx,
          prompt: `What is the definition of "${card.term}"?`,
          correctAnswer: card.definition,
          options,
          type: 'mc'
        };
      } else if (testMode === 'terms') {
        const otherCards = cards.filter((c) => c.id !== card.id);
        const distractors = [...otherCards]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((c) => c.term);

        const options = [...distractors, card.term].sort(() => 0.5 - Math.random());

        return {
          id: 'q_' + idx,
          prompt: `Which term matches: "${card.definition}"?`,
          correctAnswer: card.term,
          options,
          type: 'mc'
        };
      } else {
        return {
          id: 'q_' + idx,
          prompt: `Define or recall the definition for "${card.term}":`,
          correctAnswer: card.definition,
          type: 'written'
        };
      }
    });

    setQuestions(generated);
    setUserAnswers({});
    setTestStarted(true);
    setTestFinished(false);
  };

  const handleSelectAnswer = (questionId, value) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer || '').trim().toLowerCase();

      if (q.type === 'written') {
        if (userAns && (correctAns.includes(userAns) || userAns.includes(correctAns))) {
          correctCount++;
        }
      } else {
        if (userAns === correctAns) {
          correctCount++;
        }
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    setFinalScore(percent);
    setTestFinished(true);

    recordTestResult({
      deckId: deck.id,
      deckTitle: deck.title,
      totalQuestions: questions.length,
      correctCount,
      score: percent
    });

    if (percent >= 70) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const authorId = deck.authorId || 'user';
  const deckUrl = `/sets/${authorId}/${deck.id}`;
  const flashcardUrl = `/flashcards/${authorId}/${deck.id}`;

  return (
    <div style={{ paddingBottom: 60, maxWidth: 760, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Link
          to={deckUrl}
          className="btn btn-secondary btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Exit Test</span>
        </Link>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Practice Test Generator</h2>
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{deck.title}</div>
        </div>

        <div />
      </div>

      {/* 1. Configuration Form */}
      {!testStarted && (
        <div className="glass-card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 6 }}>Configure Test Settings</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 24 }}>
            Specify the number of questions and how answer choices should be structured.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Question Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Number of Questions
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[3, 5, 10, cards.length].map((num) => {
                  const val = Math.min(num, cards.length);
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(val)}
                      className={`btn ${questionCount === val ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '9px' }}
                    >
                      {num === cards.length ? `All (${cards.length})` : `${val} Questions`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Choices Format */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Answer Choices Format
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div
                  onClick={() => setTestMode('definitions')}
                  style={{
                    background: testMode === 'definitions' ? '#eff6ff' : '#ffffff',
                    border: testMode === 'definitions' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: 12,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    Random Definitions
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                    Pick definition for term
                  </div>
                </div>

                <div
                  onClick={() => setTestMode('terms')}
                  style={{
                    background: testMode === 'terms' ? '#eff6ff' : '#ffffff',
                    border: testMode === 'terms' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: 12,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    Random Terms
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                    Pick term for definition
                  </div>
                </div>

                <div
                  onClick={() => setTestMode('written')}
                  style={{
                    background: testMode === 'written' ? '#eff6ff' : '#ffffff',
                    border: testMode === 'written' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: 12,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    Typed Answer
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                    Short written recall
                  </div>
                </div>
              </div>
            </div>

            <button onClick={generateQuestions} className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
              Start Test
            </button>
          </div>
        </div>
      )}

      {/* 2. Questions Display */}
      {testStarted && !testFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="glass-card" style={{ padding: 24 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                Question {idx + 1} of {questions.length}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
                {q.prompt}
              </h3>

              {q.type === 'mc' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(q.id, opt)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 14px',
                        borderRadius: 8,
                        background: userAnswers[q.id] === opt ? '#eff6ff' : '#ffffff',
                        border: userAnswers[q.id] === opt ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  className="input-field"
                  placeholder="Type your answer..."
                  value={userAnswers[q.id] || ''}
                  onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <button onClick={handleSubmitTest} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}>
            Submit Test
          </button>
        </div>
      )}

      {/* 3. Results Screen */}
      {testFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: finalScore >= 70 ? '#16a34a' : '#dc2626', marginBottom: 4 }}>
              {finalScore}%
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: 20 }}>
              Correct: {questions.filter((q) => (userAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()).length} / {questions.length}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={generateQuestions} className="btn btn-secondary">
                <RotateCcw size={16} />
                <span>Retake Test</span>
              </button>
              <Link to={flashcardUrl} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <BookOpen size={16} />
                <span>Study Flashcards</span>
              </Link>
            </div>
          </div>

          {/* Breakdown */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Test Summary</h3>
          {questions.map((q, idx) => {
            const userAns = (userAnswers[q.id] || '').trim();
            const isCorrect = userAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();

            return (
              <div key={q.id} className="glass-card" style={{ padding: 16, borderLeft: isCorrect ? '4px solid #16a34a' : '4px solid #dc2626' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                  #{idx + 1} {q.prompt}
                </div>
                <div style={{ fontSize: '0.88rem', color: isCorrect ? '#16a34a' : '#dc2626' }}>
                  Your Answer: <strong>{userAns || '(No Answer)'}</strong>
                </div>
                {!isCorrect && (
                  <div style={{ fontSize: '0.88rem', color: '#2563eb', marginTop: 2 }}>
                    Correct Answer: <strong>{q.correctAnswer}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
