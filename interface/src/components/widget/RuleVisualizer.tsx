import React from 'react';
import '../../main.css';
import RuleComponent from './RuleComponent';
interface RuleVisualizerProps {
  ruleNumber: number;
}

const RuleVisualizer: React.FC<RuleVisualizerProps> = ({ ruleNumber }) => {
  const listRef = React.useRef<boolean[]>([]);
  listRef.current = ruleNumber
    .toString(2)
    .padStart(8, '0')
    .split('')
    .map((bit) => bit === '1');
  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Rule {ruleNumber}</h2>
      <div
        style={{
          display: 'flex',
          gap: '0.5em',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '100%',
          flexWrap: 'wrap',
        }}
      >
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <p className="text-md">{7 - index}</p>
            <RuleComponent
              stateNumber={7 - index}
              value={listRef.current[index]}
            />
            <br />
            {listRef.current[index] ? '1' : '0'}
          </div>
        ))}
      </div>
    </>
  );
};

export default RuleVisualizer;
