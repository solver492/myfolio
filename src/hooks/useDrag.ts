import { useCallback, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';

export function useDrag(windowId: string) {
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent, currentPos: { x: number; y: number }) => {
      if (e.button !== 0) return;
      e.preventDefault();
      isDragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { ...currentPos };
      focusWindow(windowId);

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const dx = ev.clientX - startMouse.current.x;
        const dy = ev.clientY - startMouse.current.y;
        const newX = Math.max(0, Math.min(window.innerWidth - 200, startPos.current.x + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - 60, startPos.current.y + dy));
        updatePosition(windowId, { x: newX, y: newY });
      };

      const onMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [windowId, updatePosition, focusWindow]
  );

  return { onMouseDown };
}
