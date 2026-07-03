// Protected page — logged-in users only.
// User types a destination, backend returns an AI travel recommendation.

import { useState } from 'react';
import * as api from '../services/api';
import '../styles/ai-mcp.css';

export default function AiPage() {
  const [destination, setDestination] = useState('');
  const [submitted, setSubmitted]     = useState('');   // destination that was searched
  const [result, setResult]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [fieldError, setFieldError]   = useState('');
  const [error, setError]             = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDestination(e.target.value);
    if (fieldError) setFieldError(''); // clear error as user types
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!destination.trim()) {
      setFieldError('Please enter a destination');
      return;
    }

    setFieldError('');
    setError('');
    setResult('');
    setLoading(true);
    setSubmitted(destination.trim());

    try {
      const recommendation = await api.getAiRecommendation(destination.trim());
      setResult(recommendation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setDestination('');
    setResult('');
    setError('');
    setSubmitted('');
  }

  return (
    <main className="ai-mcp-page">
      <section className="ai-mcp-card glass">

        <div className="ai-heading">
          <h1>🤖 AI Travel Advisor</h1>
          <p>Enter any destination and get a personalized travel recommendation powered by AI.</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="ai-input-row">
            <input
              type="text"
              placeholder="e.g. Paris, Bali, Tokyo…"
              value={destination}
              onChange={handleChange}
              className={fieldError ? 'input-error' : ''}
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Thinking…' : 'Ask AI'}
            </button>
          </div>
          {fieldError && <span className="field-error">{fieldError}</span>}
        </form>

        {/* Loading animation */}
        {loading && (
          <div className="ai-thinking">
            <span>Analyzing</span>
            <span className="dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        )}

        {/* Error state */}
        {error && <div className="error-msg">{error}</div>}

        {/* Result card */}
        {result && (
          <div className="ai-result-card glass">
            <div className="ai-result-header">
              <span className="ai-result-label">Recommendation for</span>
              <strong className="ai-result-dest">{submitted}</strong>
            </div>
            <p className="ai-result-text">{result}</p>
            <button className="ai-clear-btn" onClick={handleClear}>
              ↩ New search
            </button>
          </div>
        )}

      </section>
    </main>
  );
}

