import React from 'react';
import Post from '../../components/containers/Post';
import Rule30Conway from '../../components/widget/Rule30Conway';
import RuleVisualizer from '../../components/widget/RuleVisualizer';

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
            among the simplest programs. Two such automata are rule 30 and
            conway&apos;s game of life.{' '}
            <span className={'text-color-emphasis'}>
              Conway&apos;s game of life
            </span>{' '}
            is a two dimensional cellular automata calculated on a cartesian
            grid. <span className={'text-color-emphasis'}>Rule 30</span> is a
            one dimensional cellular automata
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
          dimensional cellular automata.
        </p>
        <br />
        <h3 className="comment-green"># Rule 30</h3>
        <p>
          One dimensional cellular automata are described in depth by{' '}
          <span className="text-color-emphasis">Stephen Wolfram</span> in his
          book{' '}
          <a
            href="https://www.amazon.com/New-Kind-Science-Stephen-Wolfram/dp/1579550088"
            className="href-blue"
          >
            A new kind of science
          </a>
          . They function as such, a seed value is given. The common example is
          one cell activated in the middle of a 1-D grid. Each generation the
          state of the grid is used to compute the next generation.
          <br />
          <br /> In simple 1-D CA there are two possibilities a cell is alive or
          dead in each generation. The state of the previous generation defines
          the state of the following generation. The relevant state is the
          liveness of the previous cell and its left and right neighbor. This
          yields three boolean values. 2<sup>3</sup> ={' '}
          <span className="text-color-emphasis">8</span>. There are 8 distinct
          input states that determine the state of in the following generation.
          The <span className="text-color-emphasis">Rule 30</span> is one of 256
          possible simple 1-D CA Rules. 256 = 2
          <sup>
            <span className="text-color-emphasis">8</span>
          </sup>
          ; each rule maps the distinct input states to a boolean representing
          cell liveness. <br />
          <br />
          The parity between the number of input states and the number of
          possible rules is no coincidence. Each number between 0 and 255 in
          binary is the simplest encoding of each rule. The binary for 0 padded
          to 8 digits is <span className="text-color-emphasis">
            00000000
          </span>{' '}
          this means that for all eight possible input states every output is
          false. Rule 255 is{' '}
          <span className="text-color-emphasis">11111111</span> yielding true
          for all input states. Rule 30 is{' '}
          <span className="text-color-emphasis">00011110</span> This can be
          visualized like so.
        </p>
        <br />
        <RuleVisualizer ruleNumber={0} />
        <RuleVisualizer ruleNumber={255} />
        <RuleVisualizer ruleNumber={30} />
        <br />
        <h3 className="comment-green"># Conway&apos;s Game of Life</h3>
        <p>
          Mathematician and all around genius{' '}
          <span className="text-color-emphasis">John Conway</span> devised a
          cellular automata he named the game of life. The game of life is a two
          dimensional cellular automata that has very simple rules but produces
          enough emergent complexity to support structures that can run a
          <a
            href="https://conwaylife.com/wiki/Universal_Turing_machine"
            className="href-blue underline"
          >
            universal turing machine
          </a>
          . The structures can propogate through space like the{' '}
          <a
            href="https://conwaylife.com/wiki/Glider"
            className="href-blue underline"
          >
            glider
          </a>{' '}
          or{' '}
          <a
            href="https://conwaylife.com/wiki/Replicator"
            className="href-blue underline"
          >
            self replicate
          </a>
          <br />
          <p>
            Surprisingly the game of life is easier to understand than the
            &quot;simple&quot; 1-D CAs
          </p>
        </p>
      </Post>
    </>
  );
};

export default ConwayRule30;
