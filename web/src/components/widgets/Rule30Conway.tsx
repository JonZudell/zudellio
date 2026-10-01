'use client';

import { useEffect, useRef } from 'react';

interface Rule30ConwayProps {
  cellSize?: number;
  width?: number;
  height?: number;
}

const RULE_30: Record<string, boolean> = {
  '000': false,
  '001': true,
  '010': true,
  '011': true,
  '100': true,
  '101': false,
  '110': false,
  '111': false,
};

function conwaysRule(cell: boolean, neighbours: boolean[]): boolean {
  const live = neighbours.filter(Boolean).length;
  if (cell) return live === 2 || live === 3;
  return live === 3;
}

function cssColour(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Rule 30 feeding Conway's Life, the way the conway_rule_30 post had it: the
 * top half runs the one-dimensional automaton, each row shifting down, and the
 * bottom half runs Life over what rule 30 produced.
 *
 * Ported in flow rather than as the fixed full-screen overlay the old component
 * used, which covered the post it was embedded in.
 */
export default function Rule30Conway({
  cellSize = 6,
  width = 100,
  height = 80,
}: Rule30ConwayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const grid: boolean[][] = Array.from({ length: width }, () =>
      Array<boolean>(height).fill(false),
    );
    grid[Math.floor(width / 2)][0] = true;

    // One generation: shift the rule-30 half down, compute its new top row,
    // then run Life over the bottom half.
    const advance = () => {
      for (let i = Math.floor(height / 2 - 1); i > 0; i--) {
        for (let j = 0; j < width; j++) grid[j][i] = grid[j][i - 1];
      }
      for (let j = 0; j < width; j++) {
        const centre = grid[j][1] ? 1 : 0;
        const left = grid[(j - 1 + width) % width][1] ? 1 : 0;
        const right = grid[(j + 1) % width][1] ? 1 : 0;
        const pattern = (left << 2) | (centre << 1) | right;
        grid[j][0] = RULE_30[pattern.toString(2).padStart(3, '0')];
      }

      const next = grid.map((column) => [...column]);
      for (let j = 0; j < width; j++) {
        for (let i = Math.floor(height / 2); i < height; i++) {
          const l = (j - 1 + width) % width;
          const r = (j + 1) % width;
          const up = (i - 1 + height) % height;
          const down = (i + 1) % height;
          const hasDown = i < height - 1;
          next[j][i] = conwaysRule(grid[j][i], [
            grid[l][up],
            i > 0 ? grid[j][up] : false,
            grid[r][up],
            grid[l][i],
            grid[r][i],
            hasDown ? grid[l][down] : false,
            hasDown ? grid[j][down] : false,
            hasDown ? grid[r][down] : false,
          ]);
        }
      }
      for (let j = 0; j < width; j++) grid[j] = next[j];
    };

    const paint = () => {
      const on = cssColour('--link-button-color', '#db2777');
      const off = cssColour('--background-color', '#d3d3d3');
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          context.fillStyle = grid[i][j] ? on : off;
          context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    };

    // A reader arriving at the post should find it already running rather than
    // watching an empty box fill one row every tenth of a second.
    for (let warm = 0; warm < height * 2; warm++) advance();

    let frame = 0;
    let last = 0;
    let live = true;

    const step = (time: number) => {
      if (!live) return;
      if ((time - last) / 1000 > 0.1) {
        last = time;
        paint();
        advance();
      }
      frame = requestAnimationFrame(step);
    };

    paint();
    frame = requestAnimationFrame(step);
    return () => {
      live = false;
      cancelAnimationFrame(frame);
    };
  }, [cellSize, width, height]);

  return (
    <div className="widget">
      <canvas
        ref={canvasRef}
        width={width * cellSize}
        height={height * cellSize}
        role="img"
        aria-label="Rule 30 generating rows that feed Conway's Game of Life"
      />
      <p className="widget-caption">
        # rule 30 above, conway&apos;s life below, running on what rule 30 wrote
      </p>
    </div>
  );
}
