// Public page — Log in with email + password.
//
// Validation strategy:
//   1. Client-side: email and password validated individually on submit.
//      Errors shown directly UNDER the relevant input.
//   2. Backend errors (wrong credentials): shown under the password field.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FieldError from '../components/FieldError';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import type { LoginData } from '../types';
import { validateEmail, validatePassword } from '../utils/validation';
import '../styles/auth.css';

type FieldErrors = Record<keyof LoginData, string>;

const EMPTY_ERRORS: FieldErrors = { email: '', password: '' };

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [form, setForm]           = useState<LoginData>({ email: '', password: '' });
  const [errors, setErrors]       = useState<FieldErrors>(EMPTY_ERRORS);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]     = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const next: FieldErrors = {
      email:    validateEmail(form.email)       ?? '',
      password: validatePassword(form.password) ?? '',
    };

    setErrors(next);
    if (Object.values(next).some(msg => msg)) return;

    setLoading(true);
    try {
      const { token } = await api.login(form);
      signIn(token);
      navigate('/vacations');
    } catch (err) {
      // Wrong credentials — show under password field for better UX.
      const msg = err instanceof Error ? err.message : 'Login failed';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">

      {/* Left — travel hero image + brand */}
      <aside className="auth-hero" aria-hidden="true">
        <div className="auth-hero-brand">✦ Voyagelle</div>
        <div className="auth-hero-body">
          <h1 className="auth-hero-title">Chart your next escape.</h1>
          <p className="auth-hero-tagline">
            From candle-lit trattorias in Rome to the rooftops of Bangkok — every
            journey worth taking starts with a single sign-in.
          </p>
        </div>
        <div className="auth-hero-caption">Curated getaways · Since 2024</div>
      </aside>

      {/* Right — sign-in form */}
      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="auth-heading">
            <h2>Welcome back</h2>
            <p>Log in to pick up where you left off.</p>
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            <FieldError message={errors.email} />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            <FieldError message={errors.password} />
          </div>

          {/* Server error (wrong credentials) */}
          {serverError && <div className="error-msg">{serverError}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <p className="auth-footer">
            New here? <Link to="/register">Create account</Link>
          </p>

        </form>
      </section>
    </main>
  );
}
