import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import { useSystemStore } from '../../store/systemStore';
import { StartMenu } from './StartMenu';
import { Tooltip } from './Tooltip';

function Clock() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ color: 'white', fontFamily: 'var(--xp-font)', fontSize: 'var(--xp-font-size-sm)', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.2)', minWidth: 44, textAlign: 'center' }}
      aria-label={`Heure : ${time}`}
    >
      {time}
    </div>
  );
}

const SOCIAL_TRAY = [
  { icon: '🐙', label: 'GitHub', url: 'https://github.com/solver492' },
  { icon: '💼', label: 'LinkedIn', url: 'https://linkedin.com/in/digitalsolverland' },
  { icon: '📸', label: 'Instagram', url: 'https://instagram.com/digitalsolverland' },
];

export function Taskbar() {
  const { windows, focusWindow, minimizeWindow, activeWindowId } = useWindowStore();
  const { isSoundEnabled, toggleSound } = useSystemStore();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartBtn = useCallback(() => {
    setStartMenuOpen((prev) => !prev);
    setShowNotification(false);
  }, []);

  const handleWindowBtn = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (win.isMinimized || activeWindowId !== id) {
        focusWindow(id);
      } else {
        minimizeWindow(id);
      }
    },
    [windows, activeWindowId, focusWindow, minimizeWindow]
  );

  // Max 8 visible window buttons
  const visibleWindows = windows.slice(0, 8);

  return (
    <>
      <AnimatePresence>
        {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} />}
      </AnimatePresence>

      {/* Notification bubble */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'fixed', bottom: 48, right: 8,
              background: 'white', border: '1px solid #7F9DB9',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
              padding: '8px 12px', maxWidth: 220, zIndex: 9998, borderRadius: 2,
              fontFamily: 'var(--xp-font)', fontSize: 11, cursor: 'pointer',
            }}
            onClick={() => setShowNotification(false)}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 2 }}>💬 digitalsolverland</div>
            <div>Cliquez ici pour découvrir mon travail 🖱️</div>
            <div style={{ position: 'absolute', bottom: -6, right: 12, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid white' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 40,
          background: 'var(--xp-taskbar-gradient)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', padding: '0 4px', gap: 4,
          borderTop: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.3)',
        }}
        role="toolbar"
        aria-label="Barre des tâches"
      >
        {/* Start button */}
        <Tooltip content="Menu Démarrer">
          <motion.button
            style={{
              background: 'var(--xp-start-gradient)', border: '1px solid #2A7A2A', borderRadius: 4,
              padding: '0 14px 0 10px', height: 30, display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartBtn}
            aria-label="Menu Démarrer"
            aria-expanded={startMenuOpen}
          >
            <span style={{ fontSize: 16 }}>🪟</span>
            <span style={{ color: 'white', fontFamily: 'Tahoma, sans-serif', fontSize: 13, fontStyle: 'italic', fontWeight: 'bold', textShadow: '1px 1px 1px rgba(0,0,0,0.4)' }}>
              démarrer
            </span>
          </motion.button>
        </Tooltip>

        <div style={{ width: 2, height: 28, background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />

        {/* Window buttons — scrollable, max 8 */}
        <div style={{ flex: 1, display: 'flex', gap: 4, overflow: 'hidden' }}>
          <AnimatePresence>
            {visibleWindows.map((win) => (
              <motion.button
                key={win.id}
                className={`xp-taskbar-btn${activeWindowId === win.id && !win.isMinimized ? ' active' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleWindowBtn(win.id)}
                aria-label={`Fenêtre: ${win.title}`}
                aria-pressed={activeWindowId === win.id && !win.isMinimized}
                title={win.title}
              >
                <span style={{ fontSize: 12, flexShrink: 0 }}>{win.icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{win.title}</span>
              </motion.button>
            ))}
          </AnimatePresence>
          {windows.length > 8 && (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, alignSelf: 'center', flexShrink: 0 }}>
              +{windows.length - 8}
            </div>
          )}
        </div>

        {/* System tray */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            background: 'linear-gradient(180deg, #1A4FC4 0%, #2855A8 100%)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3,
            padding: '0 4px', height: 28, gap: 2, flexShrink: 0,
          }}
          aria-label="Zone de notification"
        >
          {/* Social icons */}
          {SOCIAL_TRAY.map((s) => (
            <Tooltip key={s.label} content={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, padding: '0 2px', opacity: 0.85, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                aria-label={s.label}
              >
                {s.icon}
              </a>
            </Tooltip>
          ))}

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />

          {/* Sound toggle */}
          <Tooltip content={isSoundEnabled ? 'Son activé' : 'Son désactivé'}>
            <button
              onClick={toggleSound}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '0 2px', opacity: isSoundEnabled ? 1 : 0.5 }}
              aria-label={isSoundEnabled ? 'Désactiver le son' : 'Activer le son'}
            >
              {isSoundEnabled ? '🔊' : '🔇'}
            </button>
          </Tooltip>

          <Tooltip content="Wi-Fi connecté">
            <span style={{ fontSize: 12, opacity: 0.8 }}>📶</span>
          </Tooltip>

          <Clock />
        </div>
      </div>
    </>
  );
}
