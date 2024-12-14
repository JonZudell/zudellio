import React from 'react';
import AccessibleLink from '../input/AccessibleLink';
import '../../main.css';
import './Post.css';
interface PostProps {
  postId: string;
  author: string;
  date: Date;
  title: string;
  version: string;
  displaySummary?: boolean;
  summaryOnly?: boolean;
  summaryContent?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: string;
  style?: React.CSSProperties;
}

const Post: React.FC<PostProps> = ({
  displaySummary = false,
  postId,
  author,
  date,
  title,
  version,
  summaryContent,
  summaryOnly = false,
  children,
  classNames,
  style,
}) => {
  const humanReadableDate = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div
      className={`border-2 border-post post bg-standard-background ${classNames}`}
      style={style}
    >
      <h2>
        <span className="user-purple">{author}</span>
        {' > '}
        <a href={`/posts/${postId}`}>{title}</a> {version}
      </h2>
      <div className="comment-green">
        # Posted
        <span className="tooltip ml-1em" title={humanReadableDate}>
          {date.getTime()}
        </span>
      </div>

      {displaySummary ? (
        <>
          <div className="">{summaryContent}</div>
          {summaryOnly === false ? (
            <div className="flex justify-center mt-4">
              <AccessibleLink
                text="view_post"
                ariaLabel={`View ${title}`}
                href={`/posts/${postId}`}
                decorationLeft="< "
                decorationRight=" >"
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </div>
  );
};

export default Post;
