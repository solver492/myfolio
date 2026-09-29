import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/systemStore';

interface Pipe {
  x: number;
  y: number;
  direction: 'right' | 'left' | 'up' | 'down';
  color: string;
  length: number;
}

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FF8800'];
const CELL = 20;

export function Screensaver() {
  const setScreensaver = useSystemStore((s) => s.setScreensaver);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipesRef = useRef<Pipe[]>([]);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  const handleInteraction = () => setScreensaver(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / CELL);
    const rows = Math.floor(canvas.height / CELL);

    const addPipe = () => {
      const dirs: Pipe['direction'][] = ['right', 'left', 'up', 'down'];
      pipesRef.current.push({
        x: Math.floor(Math.random() * cols) * CELL,
        y: Math.floor(Math.random() * rows) * CELL,
        direction: dirs[Math.floor(Math.random() * 4)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        length: 0,
      });
    };

    for (let i = 0; i < 5; i++) addPipe();

    const draw = () => {
      frameRef.current++;

      if (frameRef.current % 3 === 0) {
        pipesRef.current.forEach((pipe) => {
          ctx.fillStyle = pipe.color;
          ctx.fillRect(pipe.x, pipe.y, CELL - 2, CELL - 2);

          pipe.length++;

          // Randomly change direction
          if (Math.random() < 0.08) {
            const dirs: Pipe['direction'][] = ['right', 'left', 'up', 'down'];
            pipe.direction = dirs[Math.floor(Math.random() * 4)];
          }

          // Move
          switch (pipe.direction) {
            case 'right': pipe.x = (pipe.x + CELL) % canvas.width; break;
            case 'left': pipe.x = (pipe.x - CELL + canvas.width) % canvas.width; break;
            case 'up': pipe.y = (pipe.y - CELL + canvas.height) % canvas.height; break;
            case 'down': pipe.y = (pipe.y + CELL) % canvas.height; break;
          }

          // Reset if too long
          if (pipe.length > 60) {
            pipe.length = 0;
            pipe.x = Math.floor(Math.random() * cols) * CELL;
            pipe.y = Math.floor(Math.random() * rows) * CELL;
            pipe.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          }
        });

        if (frameRef.current % 60 === 0) addPipe();
        if (pipesRef.current.length > 20) pipesRef.current.splice(0, 5);
        if (frameRef.current % 600 === 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50000,
        cursor: 'none',
      }}
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      onKeyDown={handleInteraction}
      tabIndex={0}
      aria-label="Économiseur d'écran — déplacez la souris pour revenir"
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Tahoma, sans-serif',
          fontSize: 12,
          letterSpacing: 2,
        }}
      >
        Déplacez la souris pour continuer
      </div>
    </motion.div>
  );
}
