import React, { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = [
  '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080',
  '#C0C0C0','#FFFFFF','#FF0000','#FFFF00','#00FF00','#00FFFF','#0000FF','#FF00FF',
  '#FF8040','#804000','#80FF00','#004040','#0080FF','#8000FF','#FF0080','#FF8080',
  '#FFD700','#90EE90','#ADD8E6','#DDA0DD','#F0E68C','#FA8072','#98FB98','#87CEEB',
];

type Tool = 'pencil' | 'eraser' | 'fill' | 'rect' | 'circle' | 'line';

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [bgColor] = useState('#FFFFFF');
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [bgColor]);

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const floodFill = useCallback((x: number, y: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
    const targetR = data[idx], targetG = data[idx + 1], targetB = data[idx + 2];
    const [fR, fG, fB] = fillColor.match(/\w\w/g)!.map((h) => parseInt(h, 16));
    if (targetR === fR && targetG === fG && targetB === fB) return;
    const stack = [[Math.floor(x), Math.floor(y)]];
    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      const i = (cy * canvas.width + cx) * 4;
      if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
      if (data[i] !== targetR || data[i + 1] !== targetG || data[i + 2] !== targetB) continue;
      data[i] = fR; data[i + 1] = fG; data[i + 2] = fB; data[i + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    if (tool === 'fill') { floodFill(pos.x, pos.y, color); return; }
    isDrawing.current = true;
    lastPos.current = pos;
    startPos.current = pos;
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? brushSize * 3 : brushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? bgColor : color;
    ctx.fill();
  }, [tool, color, brushSize, bgColor, floodFill]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      lastPos.current = pos;
    } else if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      if (tool === 'rect') {
        ctx.strokeRect(startPos.current.x, startPos.current.y, pos.x - startPos.current.x, pos.y - startPos.current.y);
      } else if (tool === 'circle') {
        const rx = Math.abs(pos.x - startPos.current.x) / 2;
        const ry = Math.abs(pos.y - startPos.current.y) / 2;
        ctx.ellipse(startPos.current.x + (pos.x - startPos.current.x) / 2, startPos.current.y + (pos.y - startPos.current.y) / 2, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    }
  }, [tool, color, brushSize, bgColor]);

  const stopDraw = useCallback(() => { isDrawing.current = false; }, []);

  const handleNew = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'dessin-digitalsolverland.png';
    a.click();
  };

  const tools: Array<{ id: Tool; label: string; icon: string }> = [
    { id: 'pencil', label: 'Crayon', icon: '✏️' },
    { id: 'eraser', label: 'Gomme', icon: '🧹' },
    { id: 'fill', label: 'Remplissage', icon: '🪣' },
    { id: 'rect', label: 'Rectangle', icon: '⬜' },
    { id: 'circle', label: 'Ellipse', icon: '⭕' },
    { id: 'line', label: 'Ligne', icon: '📏' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--xp-font)', userSelect: 'none' }}>
      {/* Menu bar */}
      <div style={{ background: '#D4D0C8', borderBottom: '1px solid #808080', padding: '3px 6px', display: 'flex', gap: 8, fontSize: 11 }}>
        <button className="xp-btn" style={{ fontSize: 10, height: 20, minWidth: 0, padding: '0 8px' }} onClick={handleNew}>Nouveau</button>
        <button className="xp-btn" style={{ fontSize: 10, height: 20, minWidth: 0, padding: '0 8px' }} onClick={handleSave}>Enregistrer</button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Tools panel */}
        <div style={{ width: 50, background: '#D4D0C8', borderRight: '1px solid #808080', padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tools.map((t) => (
            <button
              key={t.id}
              title={t.label}
              onClick={() => setTool(t.id)}
              style={{
                width: 38, height: 28, fontSize: 14, cursor: 'pointer', border: '1px solid',
                borderColor: tool === t.id ? '#000080 #FFFFFF #FFFFFF #000080' : '#FFFFFF #000080 #000080 #FFFFFF',
                background: tool === t.id ? '#B0B0B0' : '#D4D0C8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-pressed={tool === t.id}
              aria-label={t.label}
            >
              {t.icon}
            </button>
          ))}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, marginBottom: 2, textAlign: 'center' }}>Taille</div>
            <input
              type="range" min={1} max={20} value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Taille du pinceau"
            />
            <div style={{ fontSize: 10, textAlign: 'center' }}>{brushSize}px</div>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, overflow: 'auto', background: '#808080', display: 'flex', alignItems: 'flex-start', padding: 4 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={450}
            style={{ display: 'block', cursor: tool === 'eraser' ? 'cell' : tool === 'fill' ? 'crosshair' : 'crosshair', touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            aria-label="Zone de dessin Paint"
          />
        </div>
      </div>

      {/* Color palette */}
      <div style={{ background: '#D4D0C8', borderTop: '1px solid #808080', padding: '4px 6px', display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* Active color preview */}
        <div style={{ width: 24, height: 24, background: color, border: '2px solid #000', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 260 }}>
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 14, height: 14, background: c, cursor: 'pointer',
                border: color === c ? '2px solid #000' : '1px solid #808080',
                flexShrink: 0,
              }}
              title={c}
              role="button"
              aria-label={`Couleur ${c}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
