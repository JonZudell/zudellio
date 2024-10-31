import React from 'react';
import { useNavigate } from 'react-router';
import Button from './Button';
import './Post.css';
interface PostProps {
  postId: string;
  author: string;
  date: Date;
  title: string;
  displaySummary?: boolean;
  summaryContent?: React.ReactNode;
  children?: React.ReactNode;
}

const Post: React.FC<PostProps> = ({ displaySummary = false, postId, author, date, title, summaryContent, children }) => {
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
      <div
        className="text-xl w-full border-2 border-post"
        style={{
          boxShadow: "1em 1em 0 0", // Solid shadow effect
          padding: "1em",
          marginTop: "1em",
          marginBottom: "2em"
        }}>
        <div className=''>
          <div className='text-xl'>
            <h3><span className="text-blue-400">{author} </span>{" > " + title + " v0.1.0"}</h3>
          </div>
          <div className='text-xl text-green-400'>
            # Posted <span className="tooltip" title={humanReadableDate}>{date.getTime()}</span>
          </div>

          {displaySummary ? (
            <>
            <div className='text-xl'>
              {summaryContent}
            </div>
            <div className="flex justify-center mt-4">
              <Button text="view post" onClick={handleViewPostClick} decorationLeft='< ' decorationRight=' >'/>
            </div>
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