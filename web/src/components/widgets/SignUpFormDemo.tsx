'use client';

import { useState } from 'react';
import { CommandButton, PasswordField, TextField } from '../fields';

/**
 * The a11y post's example form. It demonstrates label association, tab order
 * and a show/hide password control; it submits nowhere, because zudell.io has
 * no account system. The old version posted to /signup, which did not exist.
 */
export default function SignUpFormDemo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [note, setNote] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setNote('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setNote('You must agree to the terms of service.');
      return;
    }
    setNote('This form is a demonstration. Nothing was submitted and no account exists.');
  };

  return (
    <form onSubmit={submit} className="standard-shadow" style={{ padding: '1.5em' }}>
      <h3 style={{ textAlign: 'center', marginTop: 0 }}>Sign Up</h3>
      <div className="form-feedback" role="status" aria-live="polite" id="signup-note">
        {note ? <p className="field-hint"># {note}</p> : null}
      </div>
      <TextField
        label="Email"
        name="demo-email"
        type="email"
        value={email}
        onChange={setEmail}
        required
        autoComplete="email"
        describedBy="signup-note"
      />
      <PasswordField name="demo-password" value={password} onChange={setPassword} required />
      <PasswordField
        label="Confirm Password"
        name="demo-confirm"
        value={confirm}
        onChange={setConfirm}
        required
      />
      <div className="field">
        <label htmlFor="demo-terms" style={{ display: 'flex', gap: '0.5em' }}>
          <input
            id="demo-terms"
            name="demo-terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: 'auto' }}
          />
          <span>I agree to the [terms_of_service]</span>
        </label>
      </div>
      <div className="form-actions">
        <CommandButton text="sign_up" type="submit" />
      </div>
      <p className="field-hint" style={{ textAlign: 'center' }}>
        # demonstration only — this form has no backend
      </p>
    </form>
  );
}
