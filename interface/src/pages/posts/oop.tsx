import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';

interface PostProps {
  displaySummary: boolean;
}

const ObjectOriented: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-10T00:00:00Z')}
      title="oop"
      version="v0.12.70"
      postId="oop"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          In the beginning, 1 January 1970, there were no paradigms only math
          and it was good. Before{' '}
          <span className="text-color-emphasis">
            object oriented programming
          </span>{' '}
          was invented there were no objects. It wasn&apos;t until 1967 that{' '}
          <span className="text-color-emphasis">Alan Kay</span> invented
          objects. This was when things started to go downhill. Before objects
          associations couldn&apos;t be made. What is the relationship between a
          person and a name? Who knows, that would be an object.
        </p>
      }
    >
      <p>
        In the beginning, 1 January 1970, there were no paradigms only math and
        it was good. Before{' '}
        <span className="text-color-emphasis">object oriented programming</span>{' '}
        was invented there were no objects. It wasn&apos;t until 1967 that{' '}
        <span className="text-color-emphasis">Alan Kay</span> invented objects.
        This was when things started to go downhill. Before objects associations
        couldn&apos;t be made. What is the relationship between a person and a
        name? Who knows, that would be an object.
      </p>
      <br />
      <h3 className="comment-green"># What are objects?</h3>
      <p>
        <span className="text-color-emphasis">
          Objects are implemented as references
        </span>
        Objects consist of functions and data. That&apos;s it. Which is a neat
        idea when the alternative is{' '}
        <span className="text-color-emphasis">
          reading assembly instructions
        </span>{' '}
        and <span className="text-color-emphasis">tracking registers</span>.
        Some people refer to functions as methods; they are wrong.
      </p>
      <br />
      <h3 className="comment-green"># Why is it the most popular paradigm?</h3>
      <p>
        In the day that OOP came out software engineers faced different
        problems. If you programmed in{' '}
        <span className="text-color-emphasis">assembly</span>, or{' '}
        <span className="text-color-emphasis">C</span> you would think in data
        structures and algorithms instead of &quot;Objects&quot; object oriented
        programming states you should encapusulate common functionality and data
        together.
      </p>
      <br />
      <h3 className="comment-green"># Gooder ideas for big thinkin&apos;</h3>
      <ul>
        <li>
          <AccessibleLink
            text={'S.O.L.I.D. Principles but mostly S L I and D'}
            href={'/posts/solid'}
            decorationLeft="["
            decorationRight="]"
            ariaLabel={'/posts/solid'}
          ></AccessibleLink>
        </li>
      </ul>
    </Post>
  );
};

export default ObjectOriented;
