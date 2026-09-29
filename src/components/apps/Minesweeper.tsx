import React, { useState, useCallback, useEffect } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Config { rows: number; cols: number; mines: number }
const CONFIGS: Record<Difficulty, Config> = {
  easy:   { rows: 9,  cols: 9,  mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard:   { rows: 16, cols: 30, mines: 99 },
};

interface Cell {
  isMine: boolean; isRevealed: boolean; isFlagged: boolean; neighborCount: number;
}

type GameState = 'idle' | 'playing' | 'won' | 'lost';

const NUM_COLORS: Record<number, string> = {
  1: '#0000FF', 2: '#008000', 3: '#FF0000', 4: '#000080',
  5: '#800000', 6: '#008080', 7: '#000000', 8: '#808080',
};

function buildGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ isMine: false, isRevealed: false, isFlagged: false, neighborCount: 0 }))
  );
}

function placeMines(grid: Cell[][], mines: number, safeR: number, safeC: number): Cell[][] {
  const g = grid.map((row) => row.map((c) => ({ ...c })));
  const rows = g.length, cols = g[0].length;
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!g[r][c].isMine && !(r === safeR && c === safeC)) {
      g[r][c].isMine = true;
      placed++;
    }
  }
  // Count neighbors
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc].isMine) count++;
        }
      g[r][c].neighborCount = count;
    }
  }
  return g;
}

function revealFlood(grid: Cell[][], r: number, c: number): Cell[][] {
  const g = grid.map((row) => row.map((cell) => ({ ...cell })));
  const rows = g.length, cols = g[0].length;
  const stack = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
    if (g[cr][cc].isRevealed || g[cr][cc].isFlagged || g[cr][cc].isMine) continue;
    g[cr][cc].isRevealed = true;
    if (g[cr][cc].neighborCount === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          stack.push([cr + dr, cc + dc]);
    }
  }
  return g;
}

export function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const cfg = CONFIGS[difficulty];
  const [grid, setGrid] = useState<Cell[][]>(() => buildGrid(cfg.rows, cfg.cols));
  const [gameState, setGameState] = useState<GameState>('idle');
  const [minesLeft, setMinesLeft] = useState(cfg.mines);
  const [time, setTime] = useState(0);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const t = setInterval(() => setTime((p) => Math.min(p + 1, 999)), 1000);
    return () => clearInterval(t);
  }, [gameState]);

  const newGame = useCallback((diff?: Difficulty) => {
    const d = diff ?? difficulty;
    const c = CONFIGS[d];
    setGrid(buildGrid(c.rows, c.cols));
    setGameState('idle');
    setMinesLeft(c.mines);
    setTime(0);
  }, [difficulty]);

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    newGame(d);
  };

  const handleReveal = useCallback((r: number, c: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    let g = grid;
    if (gameState === 'idle') {
      g = placeMines(buildGrid(cfg.rows, cfg.cols), cfg.mines, r, c);
      setGameState('playing');
    }

    if (g[r][c].isMine) {
      // Reveal all mines
      const revealed = g.map((row) =>
        row.map((cell) => ({ ...cell, isRevealed: cell.isMine ? true : cell.isRevealed }))
      );
      setGrid(revealed);
      setGameState('lost');
      return;
    }

    const newGrid = revealFlood(g, r, c);
    // Check win
    const unrevealed = newGrid.flat().filter((c) => !c.isRevealed && !c.isMine).length;
    if (unrevealed === 0) {
      setGameState('won');
    }
    setGrid(newGrid);
  }, [grid, gameState, cfg]);

  const handleFlag = useCallback((e: React.MouseEvent | React.TouchEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) =>
        ri === r && ci === c ? { ...cell, isFlagged: !cell.isFlagged } : cell
      )
    );
    setMinesLeft((p) => p + (grid[r][c].isFlagged ? 1 : -1));
    setGrid(newGrid);
  }, [grid, gameState]);

  const smiley = gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂';

  return (
    <div style={{ fontFamily: 'var(--xp-font)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Difficulty selector */}
      <div style={{ padding: '4px 8px', background: '#D4D0C8', borderBottom: '1px solid #808080', display: 'flex', gap: 6, alignItems: 'center' }}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
          <button
            key={d}
            className="xp-btn"
            style={{ fontSize: 10, height: 20, padding: '0 6px', background: difficulty === d ? '#B0B0B0' : undefined }}
            onClick={() => changeDifficulty(d)}
          >
            {d === 'easy' ? 'Facile' : d === 'medium' ? 'Moyen' : 'Difficile'}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div style={{ background: '#D4D0C8', border: '1px solid #808080', margin: 6, padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ background: '#000', color: '#FF0000', fontFamily: 'monospace', fontSize: 20, padding: '2px 6px', minWidth: 50, textAlign: 'right' }}>
          {String(minesLeft).padStart(3, '0')}
        </div>
        <button
          style={{ fontSize: 20, background: '#D4D0C8', border: '1px solid #808080', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => newGame()}
          aria-label="Nouveau jeu"
        >
          {smiley}
        </button>
        <div style={{ background: '#000', color: '#FF0000', fontFamily: 'monospace', fontSize: 20, padding: '2px 6px', minWidth: 50, textAlign: 'right' }}>
          {String(time).padStart(3, '0')}
        </div>
      </div>

      {/* Grid */}
      <div style={{ overflow: 'auto', flex: 1, padding: '0 6px 6px' }}>
        {gameState === 'won' && (
          <div style={{ textAlign: 'center', padding: '8px', background: '#d4edda', border: '1px solid #c3e6cb', marginBottom: 6, fontSize: 13, color: '#155724' }}>
            🎉 Bravo ! Vous avez gagné en {time}s !
          </div>
        )}
        {gameState === 'lost' && (
          <div style={{ textAlign: 'center', padding: '8px', background: '#f8d7da', border: '1px solid #f5c6cb', marginBottom: 6, fontSize: 13, color: '#721c24' }}>
            💥 Boom ! Vous avez touché une mine !
          </div>
        )}
        <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    onClick={() => handleReveal(r, c)}
                    onContextMenu={(e) => handleFlag(e, r, c)}
                    style={{
                      width: 20, height: 20, textAlign: 'center', lineHeight: '20px',
                      fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
                      border: cell.isRevealed ? '1px solid #808080' : '1px solid',
                      borderColor: cell.isRevealed
                        ? '#808080'
                        : '#FFFFFF #808080 #808080 #FFFFFF',
                      background: cell.isRevealed
                        ? (cell.isMine ? '#FF0000' : '#D4D0C8')
                        : '#D4D0C8',
                      color: cell.isRevealed && !cell.isMine && cell.neighborCount > 0
                        ? NUM_COLORS[cell.neighborCount]
                        : undefined,
                      userSelect: 'none',
                    }}
                    aria-label={`Cellule ${r},${c}`}
                  >
                    {cell.isFlagged && !cell.isRevealed ? '🚩' :
                     cell.isRevealed && cell.isMine ? '💣' :
                     cell.isRevealed && cell.neighborCount > 0 ? cell.neighborCount :
                     ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
