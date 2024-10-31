import React from 'react';
import { useNavigate } from 'react-router';
import Button from './Button';

interface PostProps {
  postId: string;
  author: string;
  date: Date;
  title: string;
  displaySummary?: boolean;
  summaryContent?: React.ReactNode;
  fullContent?: React.ReactNode;
}

const Post: React.FC<PostProps> = ({ displaySummary = false, postId, author, date, title, summaryContent, fullContent }) => {
  const navigate = useNavigate();

  const handleViewPostClick = () => {
    navigate(`/blog/${postId}`);
  };
  return (
    <div className='w-full'>
      {displaySummary ? (
        <div
          className="text-xl w-full border-2 border-white"
          style={{
            boxShadow: "1em 1em 0 0 white", // Solid shadow effect
            padding: "1em"
          }}>
          <div className=''>
            <div className='text-xl'>
              <h3>{author + " > " + title}</h3>
            </div>
            <div className='text-xl'>
              {"# Posted " + date.getTime()}
            </div>

            <div className='text-xl'>
              {summaryContent}
            </div>
            <div className="flex justify-center mt-4">
              <Button text="view post" onClick={handleViewPostClick} decorationLeft='< ' decorationRight=' >'/>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3>It's a post</h3>
          {fullContent}
        </div>
      )}
    </div>
  );
};

export default Post;