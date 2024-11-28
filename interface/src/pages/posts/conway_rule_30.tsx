import React from 'react';
import Post from '../../components/containers/Post';
import Rule30Conway from '../../components/widget/Rule30Conway';

interface PostProps {
  displaySummary: boolean;
}

const ConwayRule30: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <>
      {!displaySummary && (
        <div style={{ position: 'absolute', zIndex: -1 }}>
          <Rule30Conway cellSize={16} width={150} height={100} />
        </div>
      )}
      <Post
        style={{ zIndex: 1 }}
        author="jon@zudell.io"
        date={new Date('2024-11-27T00:00:00Z')}
        title="conway_rule_30"
        version="v192.168.1.1"
        postId="conway_rule_30"
        displaySummary={displaySummary}
        summaryContent={
          <p>
            <span className={'text-color-emphasis'}>Cellular automata</span> are
            among the simplest programs. Two such automata are{' '}
            <span className={'text-color-emphasis'}>rule 30</span> and
            conway&apos;s game of life.{' '}
            <span className={'text-color-emphasis'}>Conways game of life</span>{' '}
            is a two dimensional cellular automata calculated on a cartesian
            grid. Rule 30 is a one dimensional cellular automata
          </p>
        }
      >
        <p>
          <span className={'text-color-emphasis'}>Cellular automata</span> are
          among the simplest programs. Two such automata are rule 30 and
          conway&apos;s game of life.{' '}
          <span className={'text-color-emphasis'}>
            Conway&apos;s game of life
          </span>{' '}
          is a two dimensional cellular automata calculated on a cartesian grid.{' '}
          <span className={'text-color-emphasis'}>Rule 30</span> is a one
          dimensional cellular automata
        </p>
      </Post>
    </>
  );
};

export default ConwayRule30;
