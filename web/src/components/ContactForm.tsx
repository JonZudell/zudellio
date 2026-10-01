'use client';

import { useState } from 'react';
import { CommandButton, TextAreaField, TextField } from './fields';

type State = 'idle' | 'sending' | 'sent' | 'failed';

/**
 * Posts {name, email, message} to /api/contact, which validates it, logs it and
 * returns 200 — exactly what the Lambda behind the old form did. Nothing is
 * delivered anywhere, and the page says so rather than implying otherwise.
 */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<State>('idle');
  const [problem, setProblem] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState('sending');
    setProblem('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (response.ok) {
        setState('sent');
        return;
      }
      const body = (await response.json().catch(() => null)) as
        | { errors?: string[] }
        | null;
      setProblem(body?.errors?.join('; ') ?? `The server answered ${response.status}.`);
      setState('failed');
    } catch {
      setProblem('The request did not reach the server.');
      setState('failed');
    }
  };

  return (
    <form onSubmit={submit} noValidate={false}>
      <div
        className="form-feedback"
        role="status"
        aria-live="polite"
        id="contact-feedback"
      >
        {state === 'sent' ? (
          <p className="field-hint"># message accepted. it is written to the server log.</p>
        ) : null}
        {state === 'failed' ? <p className="field-error"># {problem}</p> : null}
      </div>
      <TextField
        label="Name"
        name="name"
        value={name}
        onChange={setName}
        required
        autoComplete="name"
        describedBy="contact-feedback"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        required
        autoComplete="email"
        describedBy="contact-feedback"
      />
      <TextAreaField
        label="Message"
        name="message"
        value={message}
        onChange={setMessage}
        required
        describedBy="contact-feedback"
      />
      <div className="form-actions">
        <CommandButton text="send_message" type="submit" disabled={state === 'sending'} />
      </div>
    </form>
  );
}
