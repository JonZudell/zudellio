import Link from 'next/link';

interface CommandLinkProps {
  text: string;
  href: string;
  ariaLabel?: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  current?: boolean;
}

/**
 * A link that reads like something you would type: `[software]`, `< view_post >`.
 * The first letter is underlined in the action colour, the way the old
 * AccessibleLink did it — but as a plain anchor, so keyboard and screen reader
 * behaviour is the browser's own rather than re-implemented with key handlers.
 */
export default function CommandLink({
  text,
  href,
  ariaLabel,
  decorationLeft,
  decorationRight,
  className,
  current,
}: CommandLinkProps) {
  const first = text.slice(0, 1);
  const rest = text.slice(1);
  return (
    <Link
      href={href}
      className={['span-button', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      aria-current={current ? 'page' : undefined}
    >
      {decorationLeft ? (
        <span className="span-button-decoration" aria-hidden="true">
          {decorationLeft}
        </span>
      ) : null}
      <span className="span-button-first">{first}</span>
      <span className="span-button-rest">{rest}</span>
      {decorationRight ? (
        <span className="span-button-decoration" aria-hidden="true">
          {decorationRight}
        </span>
      ) : null}
    </Link>
  );
}
