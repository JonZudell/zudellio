import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'zudell.io',
  description: 'zudell.io. — misadventures in software',
  metadataBase: new URL('https://zudell.io'),
  alternates: {
    types: { 'application/rss+xml': '/rss.xml' },
  },
};

/**
 * Honours a stored theme before first paint. Without this the page renders
 * under prefers-color-scheme and then flips once the toggle hydrates.
 */
const THEME_BOOTSTRAP = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);if(m){document.documentElement.setAttribute('data-theme',m[1]);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        <div className="page">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="content">
            {children}
          </main>
          <footer className="site-footer">
            <ThemeToggle />
            <p>&copy; 2024 zudell.io. ALL YOUR BASE ARE BELONG TO US.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
