import React from 'react';
import '../../main.css';
import Wrapper from '../containers/Wrapper';
interface RuleComponentProps {
  stateNumber: number;
  value: boolean;
}

const RuleComponent: React.FC<RuleComponentProps> = ({
  stateNumber,
  value,
}) => {
  const listRef = React.useRef<boolean[]>([]);
  listRef.current = stateNumber
    .toString(2)
    .padStart(3, '0')
    .split('')
    .map((bit) => bit === '1');
  return (
    <Wrapper
      style={{
        width: '4em',
        height: '3em',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <table style={{ width: '75%', height: '75%', margin: 'auto' }}>
        <tbody>
          <tr>
            <td
              className={`${listRef.current[0] ? 'bg-color-emphasis' : 'bg-color'} border-color`}
            ></td>
            <td
              className={`${listRef.current[1] ? 'bg-color-emphasis' : 'bg-color'} border-color`}
            ></td>
            <td
              className={`${listRef.current[2] ? 'bg-color-emphasis' : 'bg-color'} border-color`}
            ></td>
          </tr>
          <tr>
            <td></td>
            <td
              className={`${value ? 'bg-color-emphasis' : 'bg-color'} border-color`}
            ></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Wrapper>
  );
};

export default RuleComponent;
