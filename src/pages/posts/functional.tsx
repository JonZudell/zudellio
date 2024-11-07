import React from 'react';
import Post from '../../components/containers/Post';

interface PostProps {
  displaySummary?: boolean;
}

const Functional: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="functional_programming"
      version="v0.1.0"
      postId="functional_programming"
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
      <h4 className="text-lg comment-green"># Functional Programming</h4>
      <p>
        Functional Programming is simple you have functions. Functions take
        inputs and return outputs.
        <s className="text-gray-500">
          Everything else is a lie. The end. I am a functional programmer. I am
          a functional programmer. I am a functional programmer. I am a
          functional programmer. I am a functional programmer.
        </s>
        Functions can also have side effects. If a function has no side effects
        it is a pure function. Pure functions are the best functions. Pure
        functions are deterministic. This leads to the following properties:
        <ul>
          <li>Composability</li>
          <li>Parallelizability</li>
          <li>Reentrancy</li>
          <li>Idempotency</li>
          <li>Referential Transparency</li>
          <li>Memoizability</li>
        </ul>
      </p>
    </Post>
  );
};

export default Functional;
