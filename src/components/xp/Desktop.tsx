import React, { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';
import { useWindowStore } from '../../store/windowStore';
import { useSystemStore } from '../../store/systemStore';
import { useIdle } from '../../hooks/useIdle';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { ContextMenu } from './ContextMenu';
import { Screensaver } from './Screensaver';
import { Clippy } from './Clippy';
import { BSOD } from './BSOD';

// Lazy load portfolio components
const AboutMe    = lazy(() => import('../portfolio/AboutMe').then((m) => ({ default: m.AboutMe })));
const Skills     = lazy(() => import('../portfolio/Skills').then((m) => ({ default: m.Skills })));
const Projects   = lazy(() => import('../portfolio/Projects').then((m) => ({ default: m.Projects })));
const Timeline   = lazy(() => import('../portfolio/Timeline').then((m) => ({ default: m.Timeline })));
const Contact    = lazy(() => import('../portfolio/Contact').then((m) => ({ default: m.Contact })));
const CV         = lazy(() => import('../portfolio/CV').then((m) => ({ default: m.CV })));
const FolderView = lazy(() => import('./FolderView').then((m) => ({ default: m.FolderView })));

// Lazy load apps
const Paint       = lazy(() => import('../apps/Paint').then((m) => ({ default: m.Paint })));
const Solitaire   = lazy(() => import('../apps/Solitaire').then((m) => ({ default: m.Solitaire })));
const Minesweeper = lazy(() => import('../apps/Minesweeper').then((m) => ({ default: m.Minesweeper })));
const SnakeGame   = lazy(() => import('../apps/Snake').then((m) => ({ default: m.Snake })));
const RetroGames  = lazy(() => import('../apps/RetroGames').then((m) => ({ default: m.RetroGames })));
const SocialMedia = lazy(() => import('../apps/SocialMedia').then((m) => ({ default: m.SocialMedia })));
const SkillsAurora = lazy(() => import('../apps/SkillsAurora').then((m) => ({ default: m.SkillsAurora })));

function WindowLoading() {
  return (
    <div style={{ padding: 20, fontFamily: 'var(--xp-font)', fontSize: 'var(--xp-font-size-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <motion.div style={{ width: 8, height: 8, background: '#0054E3', borderRadius: 1 }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }} />
      Chargement...
    </div>
  );
}

function InternetExplorer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: '#D4D0C8', borderBottom: '1px solid #808080', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--xp-font)' }}>Adresse :</span>
        <div style={{ flex: 1, background: 'white', border: '1px solid #7F9DB9', padding: '2px 6px', fontSize: 12, fontFamily: 'var(--xp-font)' }}>
          https://digitalsolverland.dev
        </div>
      </div>
      <div style={{ flex: 1, background: 'white', padding: 20, fontFamily: 'var(--xp-font)', overflow: 'auto' }}>
        <h1 style={{ fontSize: 22, color: '#0054E3', marginBottom: 16 }}>🌐 digitalsolverland.dev</h1>
        <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
          Bienvenue sur le portfolio de <strong>digitalsolverland</strong>, Ingénieure Full-Stack & DevOps.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {['React', 'Node.js', 'Docker', 'Python', 'IA/LLM'].map((tech) => (
            <span key={tech} className="xp-badge">{tech}</span>
          ))}
        </div>
        <hr style={{ margin: '16px 0', borderColor: '#D4D0C8' }} />
        <p style={{ fontSize: 11, color: '#666' }}>Internet Explorer 6.0 — digitalsolverland.dev</p>
      </div>
    </div>
  );
}

const COMPONENT_MAP: Record<string, React.ComponentType<Record<string, unknown>>> = {
  AboutMe:         AboutMe as React.ComponentType<Record<string, unknown>>,
  Skills:          Skills as React.ComponentType<Record<string, unknown>>,
  Projects:        Projects as React.ComponentType<Record<string, unknown>>,
  Timeline:        Timeline as React.ComponentType<Record<string, unknown>>,
  Contact:         Contact as React.ComponentType<Record<string, unknown>>,
  CV:              CV as React.ComponentType<Record<string, unknown>>,
  FolderView:      FolderView as React.ComponentType<Record<string, unknown>>,
  InternetExplorer: InternetExplorer as React.ComponentType<Record<string, unknown>>,
  Paint:           Paint as React.ComponentType<Record<string, unknown>>,
  Solitaire:       Solitaire as React.ComponentType<Record<string, unknown>>,
  Minesweeper:     Minesweeper as React.ComponentType<Record<string, unknown>>,
  Snake:           SnakeGame as React.ComponentType<Record<string, unknown>>,
  RetroGames:      RetroGames as React.ComponentType<Record<string, unknown>>,
  SocialMedia:     SocialMedia as React.ComponentType<Record<string, unknown>>,
  SkillsAurora:    SkillsAurora as React.ComponentType<Record<string, unknown>>,
};

// Desktop icons including social media
const DESKTOP_ICONS = [
  { id: 'my-computer',  label: 'Poste de travail',    icon: '🖥️', position: { x: 20, y: 20  }, component: 'FolderView',      props: { folder: 'root' } },
  { id: 'my-projects',  label: 'Mes Projets',          icon: '📁', position: { x: 20, y: 110 }, component: 'FolderView',      props: { folder: 'projects' } },
  { id: 'web-dev',      label: 'Développement Web',    icon: '📁', position: { x: 20, y: 200 }, component: 'FolderView',      props: { folder: 'web' } },
  { id: 'mobile-apps',  label: 'Mobile & Apps',        icon: '📁', position: { x: 20, y: 290 }, component: 'FolderView',      props: { folder: 'mobile' } },
  { id: 'ai-auto',      label: 'IA & Automatisation',  icon: '📁', position: { x: 20, y: 380 }, component: 'FolderView',      props: { folder: 'ai' } },
  { id: 'devops',       label: 'DevOps & Cloud',       icon: '📁', position: { x: 20, y: 470 }, component: 'FolderView',      props: { folder: 'devops' } },
  { id: 'cv',           label: 'Mon CV',               icon: '📄', position: { x: 110, y: 20  }, component: 'CV',             props: {} },
  { id: 'internet-explorer', label: 'Internet Explorer', icon: '🌐', position: { x: 110, y: 110 }, component: 'InternetExplorer', props: {} },
  { id: 'recycle-bin',  label: 'Corbeille',            icon: '🗑️', position: { x: 110, y: 200 }, component: 'RecycleBin',     props: {} },
  { id: 'contact',      label: 'Me Contacter',         icon: '📧', position: { x: 110, y: 290 }, component: 'Contact',        props: {} },
  { id: 'social',       label: 'Réseaux Sociaux',      icon: '🌐', position: { x: 110, y: 380 }, component: 'SocialMedia',    props: {} },
  { id: 'skills-aurora', label: 'Skills',             icon: '📁', position: { x: 110, y: 470 }, component: 'SkillsAurora',   props: {} },
];

export function Desktop() {
  useIdle();
  const { selectIcon, setContextMenu } = useDesktopStore();
  const { windows } = useWindowStore();
  const { isScreensaverActive, isBSOD } = useSystemStore();
  const [showRecycleBin, setShowRecycleBin] = React.useState(false);
  const { openWindow, closeWindow } = useWindowStore();
  const [localIcons] = React.useState(DESKTOP_ICONS);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) selectIcon(null);
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY }, null);
  };

  // Intercept RecycleBin window opens
  React.useEffect(() => {
    const recycleBinWindow = windows.find((w) => w.component === 'RecycleBin');
    if (recycleBinWindow) {
      setShowRecycleBin(true);
      closeWindow(recycleBinWindow.id);
    }
  }, [windows, closeWindow]);

  return (
    <div
      style={{
        width: '100vw', height: '100vh',
        background: 'radial-gradient(ellipse at 60% 40%, #87C35B 0%, #5A9E35 40%, #3A7A1F 70%, #2A5A10 100%)',
        position: 'relative', overflow: 'hidden', fontFamily: 'var(--xp-font)',
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop area */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 40 }}>
        {/* Desktop icons */}
        {localIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            {...icon}
            isSelected={false}
          />
        ))}

        {/* Windows */}
        <AnimatePresence>
          {windows.map((win) => {
            const Component = COMPONENT_MAP[win.component];
            if (!Component) return null;
            return (
              <Window key={win.id} {...win} initialSize={win.size} initialPosition={win.position}>
                <Suspense fallback={<WindowLoading />}>
                  <Component {...(win.props ?? {})} />
                </Suspense>
              </Window>
            );
          })}
        </AnimatePresence>
      </div>

      <Taskbar />
      <ContextMenu />
      <Clippy />

      <AnimatePresence>
        {isScreensaverActive && <Screensaver />}
      </AnimatePresence>

      <AnimatePresence>
        {isBSOD && <BSOD />}
      </AnimatePresence>

      {/* Recycle Bin Dialog */}
      <AnimatePresence>
        {showRecycleBin && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 15000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setShowRecycleBin(false)}
          >
            <motion.div
              className="xp-dialog"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              style={{ minWidth: 320 }}
            >
              <div className="xp-titlebar">
                <span>🗑️</span>
                <span className="xp-titlebar-title">Corbeille</span>
                <button className="window-btn xp-titlebar-btn xp-titlebar-btn-close" onClick={() => setShowRecycleBin(false)}>✕</button>
              </div>
              <div style={{ padding: '20px 24px', display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 36 }}>🗑️</span>
                <p style={{ fontFamily: 'var(--xp-font)', fontSize: 13, lineHeight: 1.6 }}>
                  Cet élément est vide.<br />
                  <em>Comme les opportunités que vous n'avez pas encore saisies ! 😄</em>
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 16 }}>
                <button className="xp-btn" onClick={() => setShowRecycleBin(false)} autoFocus>OK</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
