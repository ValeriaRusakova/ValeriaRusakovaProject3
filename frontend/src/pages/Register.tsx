// Public page — Register a new account.
//
// Validation strategy:
//   1. Client-side: each field validated individually on submit.
//      Errors shown directly UNDER the relevant input.
//   2. Backend 409 (email taken): routed to the email field error.
//   3. Other backend errors: shown as a banner above the submit button.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FieldError from '../components/FieldError';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';
import * as api from '../services/api';
import type { RegisterData } from '../types';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation';
import '../styles/auth.css';

// The shape of per-field errors mirrors the form fields.
type FieldErrors = Record<keyof RegisterData, string>;

const EMPTY_ERRORS: FieldErrors = {
  firstName: '',
  lastName:  '',
  email:     '',
  password:  '',
};

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [form, setForm]         = useState<RegisterData>({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
  });
  const [errors, setErrors]       = useState<FieldErrors>(EMPTY_ERRORS);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]     = useState(false);

  // Update field value and clear its individual error as user types.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    // Run all validators and collect results.
    const next: FieldErrors = {
      firstName: validateRequired(form.firstName, 'First name') ?? '',
      lastName:  validateRequired(form.lastName,  'Last name')  ?? '',
      email:     validateEmail(form.email)                       ?? '',
      password:  validatePassword(form.password)                 ?? '',
    };

    setErrors(next);

    // Stop if any field has an error.
    if (Object.values(next).some(msg => msg)) return;

    setLoading(true);
    try {
      const { token } = await api.register(form);
      signIn(token);
      navigate('/vacations');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Email already taken — show under email field specifically.
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
      } else {
        setServerError(err instanceof Error ? err.message : 'Registration failed');
      }
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
          <h1 className="auth-hero-title">Where will you wander next?</h1>
          <p className="auth-hero-tagline">
            Join a community of travellers collecting sunsets in Santorini,
            sushi in Tokyo, and stories from every corner of the world.
          </p>
        </div>
        <div className="auth-hero-caption">Curated getaways · Since 2024</div>
      </aside>

      {/* Right — sign-up form */}
      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="auth-heading">
            <h2>Create account</h2>
            <p>It only takes a minute.</p>
          </div>

          {/* Global server error (not email-related) */}
          {serverError && <div className="error-msg">{serverError}</div>}

          <div className="field-group">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="e.g. John"
              value={form.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'input-error' : ''}
              autoComplete="given-name"
            />
            <FieldError message={errors.firstName} />
          </div>

          <div className="field-group">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="e.g. Smith"
              value={form.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'input-error' : ''}
              autoComplete="family-name"
            />
            <FieldError message={errors.lastName} />
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
              placeholder="Minimum 4 characters"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              autoComplete="new-password"
            />
            <FieldError message={errors.password} />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

        </form>
      </section>
    </main>
  );
}
