import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';
import { useWindowStore } from '../../store/windowStore';
import { useSystemStore } from '../../store/systemStore';

export function ContextMenu() {
  const { contextMenuPos, contextMenuTarget, setContextMenu, refreshIcons } = useDesktopStore();
  const { openWindow } = useWindowStore();
  const { triggerBSOD } = useSystemStore();

  if (!contextMenuPos) return null;

  const isDesktop = !contextMenuTarget;

  const menuItems = isDesktop
    ? [
        {
          label: 'Organiser les ic\xf4nes',
          icon: '🔀',
          action: () => refreshIcons(),
        },
        {
          label: 'Actualiser',
          icon: '🔄',
          action: () => {
            refreshIcons();
            setContextMenu(null);
          },
        },
        { type: 'separator' as const },
        {
          label: 'Propri\xe9t\xe9s',
          icon: '⚙️',
          action: () => {
            openWindow({
              id: 'system-props',
              title: 'Propri\xe9t\xe9s syst\xe8me',
              icon: '⚙️',
              component: 'AboutMe',
              position: { x: 200, y: 100 },
              size: { width: 480, height: 420 },
              isMinimized: false,
              isMaximized: false,
            });
            setContextMenu(null);
          },
        },
        { type: 'separator' as const },
        {
          label: 'BSOD (Easter Egg)',
          icon: '💀',
          action: () => {
            triggerBSOD();
            setContextMenu(null);
          },
        },
      ]
    : [
        {
          label: 'Ouvrir',
          icon: '📂',
          action: () => setContextMenu(null),
        },
        { type: 'separator' as const },
        {
          label: 'Renommer',
          icon: '✏️',
          action: () => setContextMenu(null),
        },
        {
          label: 'Propri\xe9t\xe9s',
          icon: '⚙️',
          action: () => setContextMenu(null),
        },
      ];

  // Keep menu in viewport
  const adjustedX = Math.min(contextMenuPos.x, window.innerWidth - 200);
  const adjustedY = Math.min(contextMenuPos.y, window.innerHeight - 200);

  return (
    <AnimatePresence>
      <motion.div
        key="context-menu"
        className="xp-menu"
        style={{
          position: 'fixed',
          left: adjustedX,
          top: adjustedY,
          zIndex: 20000,
        }}
        initial={{ opacity: 0, scale: 0.95, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ duration: 0.1 }}
      >
        {menuItems.map((item, i) =>
          item.type === 'separator' ? (
            <div key={i} className="xp-menu-separator" />
          ) : (
            <div
              key={i}
              className="xp-menu-item"
              onClick={() => 'action' in item && item.action()}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && 'action' in item) item.action();
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
}
