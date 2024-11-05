import React, { useRef } from 'react';
import Post from '../../components/containers/Post';
// import Stimmy from '../../components/widget/Stimmy';
interface PostProps {
  displaySummary?: boolean;
}

const Init: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="init"
      version="v1.0.0"
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
        <li>
          -{' '}
          <span className="tooltip" title={"Don't Repeat Yourself"}>
            D.R.Y.
          </span>
        </li>
        <li>
          -{' '}
          <span
            className="tooltip"
            title={
              'Single Responsibility, Open Close, Liskov Substitution, Interface Segregation, Dependancy Inversion'
            }
          >
            S.O.L.I.D.
          </span>
        </li>
        <li>
          -{' '}
          <span className="tooltip" title={"You Aren't Going to Need It"}>
            Y.A.G.N.I.
          </span>
        </li>
      </ul>
      {/* {dry ? <Tooltip target={dry}>Don't Repeat Yourself</Tooltip> : undefined}
      {solid ? (
        <Tooltip target={solid}>
          Sadly the meaning of this platitude has been lost to time.
        </Tooltip>
      ) : undefined}
      {yagni ? (
        <Tooltip target={yagni}>You aren't going to need it</Tooltip>
      ) : undefined} */}
    </Post>
  );
};

export default Init;
