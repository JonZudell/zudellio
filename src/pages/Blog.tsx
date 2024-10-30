import React from "react";
import { useParams } from "react-router-dom";
import Content from "../components/Content";
import Post from "../components/Post";

const Blog: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();

  return (
    <Content>
      {postId ? (
        <div>
          <h2>Blog Post {postId}</h2>
          {/* Render the specific blog post content here */}
        </div>
      ) : (
        <div>
          <h2>software misadventures</h2>
          <ul>
            <li>
              <Post displaySummary={true} />
            </li>
            <li>
              <Post displaySummary={true} />
            </li>
            <li>
              <Post displaySummary={true} />
            </li>
          </ul>
        </div>
      )}
    </Content>
  );
};

export default Blog;