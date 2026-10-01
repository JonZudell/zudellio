'use client';

import { usePathname } from 'next/navigation';
import CommandLink from './CommandLink';

/** zudell.io. with a blinking block, and `[software][contact]` under it. */
export default function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const onSoftware = pathname === '/' || pathname.startsWith('/posts');
  const onContact = pathname.startsWith('/contact');

  return (
    <header className="site-header">
      <h1>
        zudell.io.<span className="blinking-cursor" aria-hidden="true" />
      </h1>
      <nav className="site-nav" aria-label="Main">
        <CommandLink
          text="software"
          href="/"
          ariaLabel="Software"
          decorationLeft="["
          decorationRight="]"
          className="nav-link"
          current={onSoftware}
        />
        <CommandLink
          text="contact"
          href="/contact"
          ariaLabel="Contact"
          decorationLeft="["
          decorationRight="]"
          className="nav-link"
          current={onContact}
        />
      </nav>
    </header>
  );
}
