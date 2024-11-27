import React from 'react';
import '../../main.css';
import Rule30Conway from './Rule30Conway';
const ConwayContainer: React.FC = () => {
  const [cellSize] = React.useState(16);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setDimensions({
      width: Math.floor(window.innerWidth / cellSize),
      height: Math.floor(window.innerHeight / cellSize),
    });
    // handleResize();
    // window.addEventListener('resize', handleResize);

    // return () => {
    //   window.removeEventListener('resize', handleResize);
    // };
  }, []);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Rule30Conway
        width={dimensions.width}
        height={dimensions.height}
        cellSize={cellSize}
      ></Rule30Conway>
    </div>
  );
};

export default ConwayContainer;
