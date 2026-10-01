import CommandLink from '@/components/CommandLink';

export default function NotFound() {
  return (
    <div className="border-post">
      <h1 className="post-title">
        <span className="user-purple">jon@zudell.io</span>
        {' > 404 no_such_page'}
      </h1>
      <p className="comment-green"># nothing is served at that path.</p>
      <p>
        <CommandLink text="Back" href="/" ariaLabel="Go to the post list" decorationLeft="< " />
      </p>
    </div>
  );
}
