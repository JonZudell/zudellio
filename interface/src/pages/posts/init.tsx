import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';
interface PostProps {
  displaySummary?: boolean;
}

const Init: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="init"
      version="v1.2.10"
      postId="init"
      displaySummary={displaySummary}
      summaryContent={
        <p>zudell.io. is live. Enjoy misadventures in software.</p>
      }
    >
      <p>
        zudell.io. is live. Enjoy misadventures in software. The purpose of most
        articles is to function as a living document containing my opinions on
        certain subjects. Anything stated here is 100% factual™ I guarantee it.
        I have a list of platitudes to enhance your smarts:
      </p>
      <ul>
        <li>Don&apos;t Repeat Yourself</li>
        <li>Principle of Least Surprise</li>
        <li>You Aren&apos;t Going to Need It</li>
      </ul>
      <br />
      <h3 className=" comment-green"># Are they platitudes?</h3>
      <p>
        Every programmer knows that code is the enemy. Less code is more better.
        Repeating yourself leads to more code so do not do that. That feature
        management wants? You are not going to need it. How should the interface
        behave? In the least surprising way.
      </p>
      <br />
      <h3 className=" comment-green"># Better Ideas</h3>
      <ul>
        <li>
          <AccessibleLink
            text={'Functional Programming All Kinds'}
            href={'/posts/functional'}
            ariaLabel={'/posts/functional'}
            decorationLeft="[🔥"
            decorationRight="🔥]"
          ></AccessibleLink>
        </li>
        <li>
          <AccessibleLink
            text={'Testing All Kinds'}
            href={'/posts/testing'}
            decorationLeft="["
            decorationRight="]"
            ariaLabel={'/posts/testing'}
          ></AccessibleLink>
        </li>
      </ul>
    </Post>
  );
};

export default Init;
