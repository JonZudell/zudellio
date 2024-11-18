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
          <span className="text-color-emphasis">Functional Programming</span> is
          simple you have functions. Functions take inputs and return outputs.
          <s className="text-gray-500">
            Everything else is a lie. The end. I am a functional programmer. I
            am a functional programmer. I am a functional programmer. I am a
            functional programmer. I am a functional programmer.
          </s>{' '}
          Functions can also have side effects. If a function has no side
          effects it is a pure function. Pure functions are the best functions.
          This is nearly self-evident. If you have a side effecting function you
          have few guarantees.{' '}
          <img
            src="/public/posts/functional/itsalldata.png"
            alt="It's all data"
            className="w-full h-auto standard-shadow"
          />
        </p>
      }
    >
      <h3 className="comment-green"># Functional Programming</h3>
      <p>
        <span className="text-color-emphasis">Functional Programming</span> is
        simple you have functions. Functions take inputs and return outputs.
        <s className="text-gray-500">
          Everything else is a lie. The end. I am a functional programmer. I am
          a functional programmer. I am a functional programmer. I am a
          functional programmer. I am a functional programmer.
        </s>{' '}
        Functions can also have side effects. If a function has no side effects
        it is a pure function. Pure functions are the best functions. This is
        nearly self-evident. If you have a side effecting function you have few
        guarantees.{' '}
        <img
          src="/public/posts/functional/itsalldata.png"
          alt="It's all data"
          className="w-full h-auto standard-shadow"
        />
      </p>
      <br />
      <h3 className="comment-green"># Side Effects</h3>
      <p>
        As a matter of practicality, side effects are unavoidable. Side effects
        inclue input output, user interface updates, acquiring locks, querying
        any data source, the list goes on... The downsides of side effects can
        be compartmentalized and mitigated. I prefer to take an
        <AccessibleLink
          href="/posts/oop"
          ariaLabel="Go to Object Oriented Programming Post"
          text={'Object Oriented'}
          decorationLeft=" ["
          decorationRight="] "
        />
        approach to side effects. I like to encapsulate side effects in objects
        to compartmentalize and mitigate the downsides.
      </p>
      <br />
      <h3 className="comment-green"># Functions as Data</h3>
      <p>
        Good programming languages recognize the truth: Functions are Data. This
        leads to{' '}
        <span className="text-color-emphasis">higher order functions</span> if a
        language doesn&apos;t have higher order functions I don&apos;t want none
        hun. Higher Order Functions are simply functions that take functions as
        arguments. Python decorators are an example of a higher order function.
        In practice higher order functions tend wrap to wrap or call the
        functions passed to them but it is possible for a higher order function
        to <span className="text-color-emphasis">modify the function</span>{' '}
        passed to it in some way. In the world of purely functional programming
        higher order functions may exist as combinators. One such combinator is
        the{' '}
        <span className="text-color-emphasis">
          fixed point combinator otherwise known as the Y-combinator
        </span>{' '}
        it performs the function of enabling pure anonymous functions to call
        themselves.
      </p>
    </Post>
  );
};

export default Functional;
