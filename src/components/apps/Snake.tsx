import React, { useEffect, useRef, useState, useCallback } from 'react';

const CELL = 20;
const COLS = 20;
const ROWS = 16;
const INIT_SPEED = 150;

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Pos = { x: number; y: number };

function randomFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 8 }],
    dir: 'RIGHT' as Dir,
    nextDir: 'RIGHT' as Dir,
    food: { x: 15, y: 8 },
    score: 0,
    running: false,
    gameOver: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('snake-hs') ?? '0'); } catch { return 0; }
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { snake, food } = stateRef.current;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid dots
    ctx.fillStyle = '#111';
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    // Food
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#44FF44' : `hsl(${120 - i * 2}, 80%, ${40 + i}%)`;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      if (isHead) {
        ctx.fillStyle = '#000';
        const eyeOffset = stateRef.current.dir === 'RIGHT' ? [CELL - 6, 4] :
          stateRef.current.dir === 'LEFT' ? [2, 4] :
          stateRef.current.dir === 'DOWN' ? [4, CELL - 6] : [4, 2];
        ctx.fillRect(seg.x * CELL + eyeOffset[0], seg.y * CELL + eyeOffset[1], 3, 3);
      }
    });
  }, []);

  const step = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;
    s.dir = s.nextDir;
    const head = s.snake[0];
    const newHead: Pos = {
      x: (head.x + (s.dir === 'RIGHT' ? 1 : s.dir === 'LEFT' ? -1 : 0) + COLS) % COLS,
      y: (head.y + (s.dir === 'DOWN' ? 1 : s.dir === 'UP' ? -1 : 0) + ROWS) % ROWS,
    };
    // Self collision
    if (s.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
      s.running = false;
      s.gameOver = true;
      setGameOver(true);
      if (s.score > highScore) {
        setHighScore(s.score);
        try { localStorage.setItem('snake-hs', String(s.score)); } catch {}
      }
      return;
    }
    const ate = newHead.x === s.food.x && newHead.y === s.food.y;
    const newSnake = [newHead, ...s.snake.slice(0, ate ? undefined : -1)];
    s.snake = newSnake;
    if (ate) {
      s.score++;
      s.food = randomFood(newSnake);
      setDisplayScore(s.score);
      // Speed up every 5 points
      if (s.score % 5 === 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        const newSpeed = Math.max(60, INIT_SPEED - s.score * 5);
        intervalRef.current = setInterval(step, newSpeed);
      }
    }
    draw();
  }, [draw, highScore]);

  const startGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    stateRef.current = {
      snake: [{ x: 10, y: 8 }],
      dir: 'RIGHT',
      nextDir: 'RIGHT',
      food: { x: 15, y: 8 },
      score: 0,
      running: true,
      gameOver: false,
    };
    setDisplayScore(0);
    setGameOver(false);
    setStarted(true);
    draw();
    intervalRef.current = setInterval(step, INIT_SPEED);
  }, [draw, step]);

  useEffect(() => {
    draw();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [draw]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s.running) return;
      const map: Record<string, Dir> = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
      const newDir = map[e.key];
      if (!newDir) return;
      e.preventDefault();
      const opposites: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (newDir !== opposites[s.dir]) s.nextDir = newDir;
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const setDir = (dir: Dir) => {
    const s = stateRef.current;
    if (!s.running) return;
    const opposites: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (dir !== opposites[s.dir]) s.nextDir = dir;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--xp-font)', alignItems: 'center', background: '#1A1A2E', padding: 8 }}>
      {/* Score */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 8, color: 'white', fontSize: 13 }}>
        <span>Score : <strong style={{ color: '#44FF44' }}>{displayScore}</strong></span>
        <span>Record : <strong style={{ color: '#FFD700' }}>{highScore}</strong></span>
        <button
          className="xp-btn"
          style={{ fontSize: 10, height: 20, padding: '0 8px', marginLeft: 8 }}
          onClick={startGame}
        >
          {started ? 'Restart' : '▶ Jouer'}
        </button>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          style={{ display: 'block', border: '2px solid #444' }}
          aria-label="Jeu Snake"
        />
        {!started && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'white' }}>
            <div style={{ fontSize: 24 }}>🐍 SNAKE</div>
            <button className="xp-btn" style={{ fontSize: 13, padding: '4px 20px' }} onClick={startGame}>Jouer</button>
          </div>
        )}
        {gameOver && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'white' }}>
            <div style={{ fontSize: 20 }}>Game Over 💀</div>
            <div style={{ fontSize: 14 }}>Score : {displayScore}</div>
            <button className="xp-btn" style={{ fontSize: 12, padding: '3px 16px' }} onClick={startGame}>Rejouer</button>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '40px 40px 40px', gridTemplateRows: '40px 40px', gap: 4 }}>
        <div />
        <button style={{ background: '#333', color: 'white', border: '1px solid #666', borderRadius: 4, fontSize: 18, cursor: 'pointer' }} onClick={() => setDir('UP')} aria-label="Haut">↑</button>
        <div />
        <button style={{ background: '#333', color: 'white', border: '1px solid #666', borderRadius: 4, fontSize: 18, cursor: 'pointer' }} onClick={() => setDir('LEFT')} aria-label="Gauche">←</button>
        <button style={{ background: '#333', color: 'white', border: '1px solid #666', borderRadius: 4, fontSize: 18, cursor: 'pointer' }} onClick={() => setDir('DOWN')} aria-label="Bas">↓</button>
        <button style={{ background: '#333', color: 'white', border: '1px solid #666', borderRadius: 4, fontSize: 18, cursor: 'pointer' }} onClick={() => setDir('RIGHT')} aria-label="Droite">→</button>
      </div>
      <div style={{ marginTop: 6, color: '#666', fontSize: 10, textAlign: 'center' }}>
        Clavier : ↑↓←→ &nbsp;|&nbsp; Mobile : boutons ci-dessus
      </div>
    </div>
  );
}
