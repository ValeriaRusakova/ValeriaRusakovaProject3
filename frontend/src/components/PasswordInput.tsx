// Reusable password input with a "show/hide" eye toggle button.
// Behaves like a normal <input>; adds an accessible toggle to reveal the value.

import { useState } from 'react';

interface Props {
  id:            string;
  name:          string;
  value:         string;
  onChange:      (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?:  string;
  autoComplete?: string;
  className?:    string;
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  className,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={className}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? (
          // Eye with slash — password visible, click to hide
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.79 19.79 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.75 19.75 0 0 1-4.19 5.19" />
            <path d="M1 1l22 22" />
            <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24" />
          </svg>
        ) : (
          // Open eye — password hidden, click to show
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
