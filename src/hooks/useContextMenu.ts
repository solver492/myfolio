import { useCallback, useEffect } from 'react';
import { useDesktopStore } from '../store/desktopStore';

export function useContextMenu() {
  const setContextMenu = useDesktopStore((s) => s.setContextMenu);
  const contextMenuPos = useDesktopStore((s) => s.contextMenuPos);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, targetId?: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY }, targetId ?? null);
    },
    [setContextMenu]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  useEffect(() => {
    if (!contextMenuPos) return;
    const handler = () => closeContextMenu();
    document.addEventListener('click', handler);
    document.addEventListener('contextmenu', handler);
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('contextmenu', handler);
    };
  }, [contextMenuPos, closeContextMenu]);

  return { handleContextMenu, closeContextMenu };
}
