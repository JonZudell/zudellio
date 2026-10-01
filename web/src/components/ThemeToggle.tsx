'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function current(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Both themes work from prefers-color-scheme alone; this only records a
 * reader's override, in a cookie the way the old site did, and sets
 * data-theme, which globals.css reads at a higher specificity than the media
 * query. The button is hidden until mounted so server and client markup agree.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
  }, []);

  const toggle = () => {
    const next: Theme = (theme ?? current()) === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    setTheme(next);
  };

  if (theme === null) return null;

  const label = theme === 'light' ? 'dark_mode' : 'light_mode';
  return (
    <button type="button" className="button" onClick={toggle} aria-label="Toggle colour theme">
      <span className="button-first">{label.slice(0, 1)}</span>
      <span>{label.slice(1)}</span>
    </button>
  );
}
