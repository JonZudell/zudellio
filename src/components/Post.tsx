import React from 'react';
import { useNavigate } from 'react-router';
import Button from './Button';
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

const Post: React.FC<PostProps> = ({ displaySummary = false, postId, author, date, title, version, summaryContent, summaryOnly = false, children, classNames }) => {
  const navigate = useNavigate();

  const handleViewPostClick = () => {
    navigate(`/blog/${postId}`);
  };

  const humanReadableDate = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className='w-full'>
      <div className={`text-xl w-full border-2 border-post ${classNames}`}>
        <div className=''>
          <div className='text-xl'>
            <h3><span className="user-purple">{author}</span>{" > " + title + " " + version}</h3>
          </div>
          <div className='text-xl comment-green'>
            # Posted <span className="tooltip" title={humanReadableDate}>{date.getTime()}</span>
          </div>

          {displaySummary ? (
            <>
              <div className='text-xl'>
                {summaryContent}
              </div>
              {summaryOnly === false ? (
                <div className="flex justify-center mt-4">
                  <Button text="view_post" onClick={handleViewPostClick} decorationLeft='< ' decorationRight=' >' />
                </div>
              ) : null}
            </>
          ) : (
            <div className='text-xl'>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;