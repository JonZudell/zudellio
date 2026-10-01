'use client';

import { useEffect, useRef } from 'react';

interface StimmyProps {
  width?: number;
  height?: number;
  degreesOfFreedom?: number;
}

const ARM = 100; // pixels between bobs, as in the original
const GRAVITY = 900; // pixels per second squared
const RELAXATIONS = 40; // constraint passes per step
const STEP = 1 / 240; // fixed physics step

function cssColour(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * A chain of pendulums pinned to a point and kicked once at random. At four
 * arms it is the eye of chaos; at one it is a harmonic oscillator and perfectly
 * predictable. The angle between successive arms is drawn as it moves.
 *
 * The original used @flyover/box2d for a chain of revolute joints. That package
 * ships TypeScript sources that do not type-check, and a rigid chain under
 * gravity is Verlet integration plus distance constraints, so it is done here
 * instead of carrying the dependency into the image.
 */
export default function Stimmy({
  width = 640,
  height = 480,
  degreesOfFreedom = 4,
}: StimmyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const arms = Math.max(1, degreesOfFreedom);
    const anchor = { x: canvas.width / 2, y: 50 };

    // Position and previous position per bob; the gap between them is velocity.
    const pos = Array.from({ length: arms }, (_, i) => ({
      x: anchor.x,
      y: anchor.y + (i + 1) * ARM,
    }));
    const prev = pos.map((p) => ({
      x: p.x - (Math.random() - 0.5) * 12,
      y: p.y - (Math.random() - 0.5) * 12,
    }));

    const integrate = () => {
      for (let i = 0; i < arms; i++) {
        const p = pos[i];
        const q = prev[i];
        const vx = p.x - q.x;
        const vy = p.y - q.y;
        q.x = p.x;
        q.y = p.y;
        p.x += vx;
        p.y += vy + GRAVITY * STEP * STEP;
      }
      for (let pass = 0; pass < RELAXATIONS; pass++) {
        for (let i = 0; i < arms; i++) {
          const a = i === 0 ? anchor : pos[i - 1];
          const b = pos[i];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1e-6;
          const correction = (d - ARM) / d;
          // The anchor and everything above this bob is treated as the heavier
          // side, so a correction moves the lower bob more: a chain, not a spring.
          if (i === 0) {
            b.x -= dx * correction;
            b.y -= dy * correction;
          } else {
            a.x += dx * correction * 0.25;
            a.y += dy * correction * 0.25;
            b.x -= dx * correction * 0.75;
            b.y -= dy * correction * 0.75;
          }
        }
      }
    };

    let frame = 0;
    let last = 0;
    let live = true;

    const draw = (time: number) => {
      if (!live) return;
      const elapsed = last === 0 ? STEP : Math.min((time - last) / 1000, 1 / 20);
      last = time;
      for (let steps = Math.round(elapsed / STEP); steps > 0; steps--) integrate();

      const ink = cssColour('--text-color', '#1a1a1a');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      ctx.lineWidth = 2;
      ctx.font = "12px Consolas, 'Courier New', monospace";

      for (let i = 0; i < arms; i++) {
        const from = i === 0 ? anchor : pos[i - 1];
        const to = pos[i];
        ctx.beginPath();
        ctx.moveTo(Math.floor(from.x), Math.floor(from.y));
        ctx.lineTo(Math.floor(to.x), Math.floor(to.y));
        ctx.stroke();
      }

      for (let i = 0; i < arms - 1; i++) {
        const a = i === 0 ? anchor : pos[i - 1];
        const b = pos[i];
        const c = pos[i + 1];
        const start = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI;
        const end = Math.atan2(c.y - b.y, c.x - b.x) + Math.PI * 2;
        const degrees = ((end - start) * 180) / Math.PI;
        ctx.fillText(`theta: ${degrees.toFixed(2)}`, Math.floor(b.x) + 25, Math.floor(b.y));
        ctx.beginPath();
        ctx.arc(
          Math.floor(b.x),
          Math.floor(b.y),
          20,
          i % 2 === 0 ? start : end,
          i % 2 === 0 ? end : start,
          false,
        );
        ctx.stroke();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      live = false;
      cancelAnimationFrame(frame);
    };
  }, [degreesOfFreedom]);

  return (
    <div className="widget">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: `${height}px` }}
        role="img"
        aria-label={
          degreesOfFreedom > 1
            ? `A chain of ${degreesOfFreedom} pendulums swinging chaotically`
            : 'A single pendulum swinging predictably'
        }
      />
      <p className="widget-caption">
        #{' '}
        {degreesOfFreedom > 1
          ? `${degreesOfFreedom} arms, one kick, no two runs alike`
          : 'one arm, harmonic, predictable'}
      </p>
    </div>
  );
}
