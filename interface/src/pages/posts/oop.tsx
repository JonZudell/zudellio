import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';

interface PostProps {
  displaySummary?: boolean;
}

const ObjectOriented: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="oop"
      version="v0.1.0"
      postId="oop"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          In the beginning, 1 January 1970, there were no paradigms only math
          and it was good. Before object oriented programming was invented there
          were no objects. It wasn&apos;t until 1967 that Alan Kay invented
          objects. This was when things started to go downhill. Before objects
          associations couldn&apos;t be made. What is the relationship between a
          person and a name? Who knows those are objects.
        </p>
      }
    >
      <p>
        In the beginning, 1 January 1970, there were no paradigms only math and
        it was good. Before object oriented programming was invented there were
        no objects. It wasn&apos;t until 1967 that Alan Kay invented objects.
        This was when things started to go downhill. Before objects associations
        couldn&apos;t be made. What is the relationship between a person and a
        name? Who knows those are objects.
      </p>
      <br />
      <h3 className="comment-green"># What are objects?</h3>
      <p>
        Objects consist of functions and data. That&apos;s it. Which is a neat
        idea when the alternative is reading assembly instructions and register
        values. Some people refer to functions as methods; they are wrong.
      </p>
    </Post>
  );
};

export default ObjectOriented;
