import React from "react";
import { useParams } from "react-router-dom";
import Init from "./posts/init";

const SoftwareBlog: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();

  return (
    <>
      {postId ? (
        <div>
          <h2>Blog Post {postId}</h2>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center items-center">
            <h2 className="text-xl">software misadventures</h2>
          </div>
          <ul>
            <li>
              <Init displaySummary={true} />
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default SoftwareBlog;