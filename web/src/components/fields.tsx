'use client';

import { useId, useState } from 'react';

/**
 * The inputs, kept deliberately plain: a real <label for>, a real <input>, the
 * browser's own focus ring replaced by a visible outline of the site's blue,
 * and no key handlers re-implementing what the element already does. The old
 * site's accessible-input components were careful about this; the careful part
 * was the markup, not the machinery around it.
 */

interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  describedBy?: string;
}

export function TextField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  autoComplete,
  describedBy,
}: TextFieldProps) {
  const id = `${name}-${useId()}`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  describedBy?: string;
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 6,
  required,
  describedBy,
}: TextAreaFieldProps) {
  const id = `${name}-${useId()}`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        required={required}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface PasswordFieldProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

/**
 * Show / hide is a real button with a text label rather than an icon font:
 * one less dependency, and it reads as a command like everything else.
 */
export function PasswordField({
  label = 'Password',
  name,
  value,
  onChange,
  required,
}: PasswordFieldProps) {
  const id = `${name}-${useId()}`;
  const [shown, setShown] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div style={{ display: 'flex', gap: '0.5em', alignItems: 'flex-start' }}>
        <input
          id={id}
          name={name}
          type={shown ? 'text' : 'password'}
          value={value}
          required={required}
          autoComplete="new-password"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="button"
          style={{ marginBottom: 0, whiteSpace: 'nowrap' }}
          aria-pressed={shown}
          onClick={() => setShown((s) => !s)}
        >
          <span className="button-first">{shown ? 'h' : 's'}</span>
          <span>{shown ? 'ide' : 'how'}</span>
        </button>
      </div>
    </div>
  );
}

interface CommandButtonProps {
  text: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export function CommandButton({ text, type = 'button', disabled, onClick }: CommandButtonProps) {
  return (
    <button type={type} className="button" disabled={disabled} onClick={onClick}>
      <span className="button-first">{text.slice(0, 1)}</span>
      <span>{text.slice(1)}</span>
    </button>
  );
}
