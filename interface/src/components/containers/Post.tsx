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
    <div className={`w-full border-2 border-post post ${classNames}`}>
      <h2>
        <span className="user-purple">{author}</span>
        {' > ' + title + ' ' + version}
      </h2>
      <div className="comment-green">
        # Posted
        <span className="tooltip ml-0_5em" title={humanReadableDate}>
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