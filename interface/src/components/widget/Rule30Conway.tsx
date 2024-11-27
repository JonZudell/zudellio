import React, { useRef, useEffect, useState } from 'react';
interface Rule30ConwayProps {
  className?: string;
  cellSize: number;
  width: number;
  height: number;
}
function toBinaryString(num: number): string {
  return num.toString(2).padStart(3, '0');
}
function rule30(): { [key: string]: boolean } {
  const rule = {
    '000': false,
    '001': true,
    '010': true,
    '011': true,
    '100': true,
    '101': false,
    '110': false,
    '111': false,
  };
  return rule;
}

const Rule30Conway: React.FC<Rule30ConwayProps> = ({
  className,
  cellSize,
  height,
  width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationFrameId, setAnimationFrameId] = useState<number>(0);
  const grid = useRef<boolean[][]>(
    Array.from({ length: width }, () => Array(height).fill(false)),
  );
  const lastTimeRef = useRef<number>(0);
  const iterationRef = useRef<number>(0);
  const rule = useRef(rule30());
  const iterate = (time: number) => {
    const deltaTime = (time - lastTimeRef.current) / 1000;
    if (deltaTime > 0.01) {
      // Draw
      lastTimeRef.current = time;
      iterationRef.current += 1;
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
              if (grid.current[i][j]) {
                context.fillStyle = '#db2777';
              } else {
                context.fillStyle = 'black';
              }
              context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
          context.font = '32px Consolas';
          context.fillStyle = 'green';
          context.fillText(`Iteration: ${iterationRef.current}`, 16, 32);
        }
        // Add your canvas drawing logic here
      }
      // Iterate
      for (let i = height - 1; i > 0; i--) {
        for (let j = 0; j < width; j++) {
          grid.current[j][i] = grid.current[j][i - 1];
        }
      }
      for (let j = 0; j < width; j++) {
        const center = grid.current[j][1] ? 1 : 0;
        const left = grid.current[(j - 1 + width) % width][1] ? 1 : 0;
        const right = grid.current[(j + 1) % width][1] ? 1 : 0;
        const pattern = (left << 2) | (center << 1) | right;
        grid.current[j][0] = rule.current[toBinaryString(pattern)];
      }
      //for (let i = 1; i < 50; i++) {
      //  grid.current[i] = grid.current[i - 1];
      //}
    }
    setAnimationFrameId(requestAnimationFrame(iterate));
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        //context.translate((width * cellSize) / 2, 0);
      }
    }
  }, [width, cellSize]);
  useEffect(() => {
    grid.current[Math.floor(width / 2)][0] = true;
    setAnimationFrameId(requestAnimationFrame(iterate));
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const aspectRatio = width / height;
        const windowAspectRatio = window.innerWidth / window.innerHeight;
        if (windowAspectRatio > aspectRatio) {
          canvas.style.height = `${window.innerHeight}px`;
        } else {
          canvas.style.height = `${window.innerWidth / aspectRatio}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  return (
    <div
      className={`${className} fixed inset-0 flex items-center justify-center overflow-hidden`}
      style={{
        overflowY: 'hidden',
        overflowX: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width * cellSize}
        height={height * cellSize}
        style={{
          minHeight: '100%',
        }}
      />
    </div>
  );
};

export default Rule30Conway;
