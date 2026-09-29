import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import { useSound } from '../../hooks/useSound';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
  initialSize: { width: number; height: number };
  initialPosition: { x: number; y: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const windowVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    y: 20,
    transition: { duration: 0.15 },
  },
};

const isMobileDevice = () =>
  'ontouchstart' in window || window.innerWidth < 768;

export const Window = React.memo(function Window({
  id,
  title,
  icon,
  children,
  isMinimized,
  isMaximized,
  zIndex,
  position,
  size,
}: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition, updateSize } =
    useWindowStore();
  const { play } = useSound();
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const isActive = activeWindowId === id;

  // Mobile fullscreen state
  const [isMobileFS, setIsMobileFS] = useState(() => isMobileDevice());
  const prevSize = useRef(size);
  const prevPos = useRef(position);

  // Drag state (mouse + touch)
  const titleBarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Resize state
  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const [resizingState, setResizingState] = useState(false);

  // ── DRAG (mouse + touch) ──────────────────────────────────────────
  useEffect(() => {
    const titleBar = titleBarRef.current;
    if (!titleBar) return;

    // Mouse drag
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.window-btn')) return;
      if (isMaximized || isMobileFS) return;
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      dragStartPos.current = { ...position };
      focusWindow(id);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      updatePosition(id, {
        x: Math.max(0, Math.min(window.innerWidth - 100, dragStartPos.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 40, dragStartPos.current.y + dy)),
      });
    };

    const onMouseUp = () => { isDragging.current = false; };

    // Touch drag
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.window-btn')) return;
      if (isMaximized || isMobileFS) return;
      e.preventDefault();
      const t = e.touches[0];
      isDragging.current = true;
      dragStart.current = { x: t.clientX, y: t.clientY };
      dragStartPos.current = { ...position };
      focusWindow(id);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - dragStart.current.x;
      const dy = t.clientY - dragStart.current.y;
      updatePosition(id, {
        x: Math.max(0, Math.min(window.innerWidth - 100, dragStartPos.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 40, dragStartPos.current.y + dy)),
      });
    };

    const onTouchEnd = () => { isDragging.current = false; };

    titleBar.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    titleBar.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      titleBar.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      titleBar.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [id, position, isMaximized, isMobileFS, focusWindow, updatePosition]);

  // ── RESIZE (mouse) ────────────────────────────────────────────────
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      setResizingState(true);
      resizeStart.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };

      const onMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        updateSize(id, {
          width: Math.max(300, resizeStart.current.w + ev.clientX - resizeStart.current.x),
          height: Math.max(200, resizeStart.current.h + ev.clientY - resizeStart.current.y),
        });
      };
      const onMouseUp = () => {
        isResizing.current = false;
        setResizingState(false);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [id, size.width, size.height, updateSize]
  );

  // ── RESIZE (touch) ────────────────────────────────────────────────
  const handleResizeTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      resizeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, w: size.width, h: size.height };

      const onTouchMove = (ev: TouchEvent) => {
        if (!isResizing.current) return;
        ev.preventDefault();
        const t = ev.touches[0];
        updateSize(id, {
          width: Math.max(280, resizeStart.current.w + t.clientX - resizeStart.current.x),
          height: Math.max(180, resizeStart.current.h + t.clientY - resizeStart.current.y),
        });
      };
      const onTouchEnd = () => {
        isResizing.current = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    },
    [id, size.width, size.height, updateSize]
  );

  // ── MOBILE FULLSCREEN TOGGLE ──────────────────────────────────────
  const toggleMobileFullscreen = useCallback(() => {
    if (isMobileFS) {
      updateSize(id, prevSize.current);
      updatePosition(id, prevPos.current);
      setIsMobileFS(false);
    } else {
      prevSize.current = size;
      prevPos.current = position;
      updateSize(id, { width: window.innerWidth, height: window.innerHeight - 40 });
      updatePosition(id, { x: 0, y: 0 });
      setIsMobileFS(true);
    }
  }, [id, isMobileFS, size, position, updateSize, updatePosition]);

  // ── ACTIONS ───────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    play('close');
    closeWindow(id);
  }, [id, closeWindow, play]);

  const handleMinimize = useCallback(() => minimizeWindow(id), [id, minimizeWindow]);
  const handleMaximize = useCallback(() => maximizeWindow(id), [id, maximizeWindow]);
  const handleFocus = useCallback(() => focusWindow(id), [id, focusWindow]);

  if (isMinimized) return null;

  const isMobile = isMobileDevice();

  const computedStyle = isMaximized || isMobileFS
    ? { width: '100vw' as const, height: 'calc(100vh - 40px)', left: 0, top: 0 }
    : { width: size.width, height: size.height, left: position.x, top: position.y };

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        variants={windowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          position: 'absolute',
          zIndex,
          cursor: resizingState ? 'se-resize' : 'default',
          ...computedStyle,
        }}
        className="xp-window"
        onMouseDown={handleFocus}
        onTouchStart={handleFocus}
        aria-label={`Fenêtre: ${title}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Title bar */}
        <div
          ref={titleBarRef}
          className="xp-titlebar"
          style={{ opacity: isActive ? 1 : 0.7, touchAction: 'none' }}
          aria-label={`Barre de titre: ${title}`}
        >
          <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
          <span className="xp-titlebar-title">{title}</span>

          {/* Mobile fullscreen button */}
          {isMobile && (
            <button
              className="window-btn xp-titlebar-btn xp-titlebar-btn-maximize"
              onClick={toggleMobileFullscreen}
              title="Plein écran"
              aria-label="Plein écran"
              style={{ marginRight: 2 }}
            >
              ⛶
            </button>
          )}

          <button
            className="window-btn xp-titlebar-btn xp-titlebar-btn-minimize"
            onClick={handleMinimize}
            aria-label="Réduire"
            title="Réduire"
          >
            &#x2013;
          </button>
          <button
            className="window-btn xp-titlebar-btn xp-titlebar-btn-maximize"
            onClick={handleMaximize}
            aria-label={isMaximized ? 'Restaurer' : 'Agrandir'}
            title={isMaximized ? 'Restaurer' : 'Agrandir'}
          >
            {isMaximized || isMobileFS ? '❐' : '□'}
          </button>
          <button
            className="window-btn xp-titlebar-btn xp-titlebar-btn-close"
            onClick={handleClose}
            aria-label="Fermer"
            title="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '8px',
            background: 'var(--xp-window-bg)',
            position: 'relative',
          }}
        >
          {children}
        </div>

        {/* Resize handle — larger on mobile */}
        {!isMaximized && !isMobileFS && (
          <div
            onMouseDown={handleResizeMouseDown}
            onTouchStart={handleResizeTouchStart}
            aria-label="Redimensionner la fenêtre"
            role="separator"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: isMobile ? 40 : 20,
              height: isMobile ? 40 : 20,
              cursor: 'se-resize',
              background: isMobile
                ? 'rgba(0,80,200,0.15)'
                : 'linear-gradient(135deg, transparent 50%, #808080 50%, #808080 56%, transparent 56%, transparent 62%, #808080 62%, #808080 68%, transparent 68%, transparent 74%, #808080 74%, #808080 80%, transparent 80%)',
              borderTopLeftRadius: isMobile ? 4 : 0,
              touchAction: 'none',
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
});
