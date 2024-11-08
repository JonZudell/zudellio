import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';

interface PostProps {
  displaySummary?: boolean;
}

const Functional: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="functional"
      version="v0.1.0"
      postId="functional"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          Functional Programming is simple you have functions. Functions take
          inputs and return outputs.
          <s className="text-gray-500">
            Everything else is a lie. The end. I am a functional programmer. I
            am a functional programmer. I am a functional programmer. I am a
            functional programmer. I am a functional programmer.
          </s>
        </p>
      }
    >
      <h4 className="comment-green"># Functional Programming</h4>
      <p>
        Functional Programming is simple you have functions. Functions take
        inputs and return outputs. Functions can also have side effects. If a
        function has no side effects it is a pure function. Pure functions are
        the best functions. This is nearly self-evident. If you have a side
        effecting function you have few guarantees.
      </p>
      <br />
      <h4 className="comment-green"># Side Effects</h4>
      <p>
        As a matter of practicality, side effects are unavoidable. Side effects
        inclue input output, user interface updates, acquiring locks, querying
        any data source, the list goes on... The downsides of side effects can
        be compartmentalized and mitigated. I prefer to take an{' '}
        <AccessibleLink
          href="/posts/oop"
          text={'Object Oriented'}
          decorationLeft="["
          decorationRight="]"
        />{' '}
        approach to side effects. I like to encapsulate side effects in objects
        to compartmentalize and mitigate the downsides.
      </p>
    </Post>
  );
};

export default Functional;
