import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';
import { useWindowStore } from '../../store/windowStore';
import { useSound } from '../../hooks/useSound';
import { useContextMenu } from '../../hooks/useContextMenu';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  position: { x: number; y: number };
  isSelected: boolean;
  component: string;
  props?: Record<string, unknown>;
}

const WINDOW_SIZES: Record<string, { width: number; height: number }> = {
  FolderView: { width: 640, height: 480 },
  CV: { width: 700, height: 550 },
  InternetExplorer: { width: 800, height: 560 },
  RecycleBin: { width: 360, height: 200 },
  Contact: { width: 500, height: 520 },
  AboutMe: { width: 560, height: 480 },
  Skills: { width: 540, height: 500 },
  Projects: { width: 700, height: 520 },
  Timeline: { width: 600, height: 500 },
};

export const DesktopIcon = React.memo(function DesktopIcon({
  id,
  label,
  icon,
  position,
  isSelected,
  component,
  props,
}: DesktopIconProps) {
  const { selectIcon } = useDesktopStore();
  const { openWindow } = useWindowStore();
  const { play } = useSound();
  const { handleContextMenu } = useContextMenu();
  const lastClickTime = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastClickTime.current < 400) {
        // Double click
        play('open');
        const size = WINDOW_SIZES[component] ?? { width: 600, height: 450 };
        const pos = {
          x: Math.min(position.x + 30, window.innerWidth - size.width - 10),
          y: Math.min(position.y + 30, window.innerHeight - size.height - 50),
        };
        openWindow({
          id,
          title: label,
          icon,
          component,
          props,
          position: pos,
          size,
          isMinimized: false,
          isMaximized: false,
        });
      } else {
        selectIcon(id);
      }
      lastClickTime.current = now;
    },
    [id, label, icon, component, props, position, selectIcon, openWindow, play]
  );

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => handleContextMenu(e, id),
    [id, handleContextMenu]
  );

  return (
    <motion.div
      className={`xp-desktop-icon${isSelected ? ' selected' : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      tabIndex={0}
      role="button"
      aria-label={`Ic\xf4ne: ${label} — double-cliquez pour ouvrir`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // Simulate double click on Enter
          play('open');
          const size = WINDOW_SIZES[component] ?? { width: 600, height: 450 };
          openWindow({
            id,
            title: label,
            icon,
            component,
            props,
            position: { x: position.x + 30, y: position.y + 30 },
            size,
            isMinimized: false,
            isMaximized: false,
          });
        }
      }}
    >
      <div style={{ fontSize: 32 }}>{icon}</div>
      <span className="xp-desktop-icon-label">{label}</span>
    </motion.div>
  );
});
