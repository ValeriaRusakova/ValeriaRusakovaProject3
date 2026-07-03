// Protected page — logged-in users only.
// User types a natural-language question about the vacation database.

import { useState } from 'react';
import * as api from '../services/api';
import '../styles/ai-mcp.css';

export default function McpPage() {
  const [question, setQuestion]   = useState('');
  const [submitted, setSubmitted] = useState('');
  const [result, setResult]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [error, setError]         = useState('');

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuestion(e.target.value);
    if (fieldError) setFieldError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!question.trim()) {
      setFieldError('Please enter a question');
      return;
    }

    setFieldError('');
    setError('');
    setResult('');
    setLoading(true);
    setSubmitted(question.trim());

    try {
      const answer = await api.askMcp(question.trim());
      setResult(answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MCP request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQuestion('');
    setResult('');
    setError('');
    setSubmitted('');
  }

  return (
    <main className="ai-mcp-page">
      <section className="ai-mcp-card glass">

        <div className="mcp-heading">
          <h1>🔌 Database Query</h1>
          <p>Ask any natural-language question about the vacation database and get an instant answer.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mcp-input-col">
            <textarea
              rows={3}
              placeholder="e.g. How many vacations are in Europe? Which destination has the most likes?"
              value={question}
              onChange={handleChange}
              className={fieldError ? 'input-error' : ''}
              autoFocus
            />
            {fieldError && <span className="field-error">{fieldError}</span>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Querying…' : 'Ask'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mcp-thinking">
            <span>Querying database</span>
            <span className="dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {result && (
          <div className="mcp-result-card glass">
            <div className="mcp-result-header">
              <span className="mcp-result-label">Your question</span>
              <em className="mcp-result-question">"{submitted}"</em>
            </div>
            <p className="mcp-result-text">{result}</p>
            <button className="mcp-clear-btn" onClick={handleClear}>
              ↩ Ask another question
            </button>
          </div>
        )}

      </section>
    </main>
  );
}

