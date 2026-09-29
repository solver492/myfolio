import React from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import { useSystemStore } from '../../store/systemStore';
import avatarImg from '../../assets/avatar.jpg';

interface StartMenuProps {
  onClose: () => void;
}

interface MenuItem {
  icon: string;
  label: string;
  action: () => void;
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow } = useWindowStore();
  const { setPhase } = useSystemStore();
  const openWindows = useWindowStore((s) => s.windows);

  const openApp = (id: string, title: string, icon: string, component: string, props?: Record<string, unknown>) => {
    const cascadeOffset = openWindows.length * 30;
    const SIZE_MAP: Record<string, { width: number; height: number }> = {
      Paint: { width: 720, height: 540 },
      Solitaire: { width: 700, height: 520 },
      Minesweeper: { width: 340, height: 420 },
      Snake: { width: 480, height: 480 },
      RetroGames: { width: 740, height: 560 },
      SocialMedia: { width: 540, height: 500 },
      FolderView: { width: 640, height: 480 },
      AboutMe: { width: 560, height: 480 },
      Skills: { width: 540, height: 500 },
      CV: { width: 700, height: 550 },
      Contact: { width: 500, height: 520 },
    };
    const size = SIZE_MAP[component] ?? { width: 600, height: 450 };
    openWindow({
      id,
      title,
      icon,
      component,
      props,
      position: { x: 50 + cascadeOffset, y: 50 + cascadeOffset },
      size,
      isMinimized: false,
      isMaximized: false,
    });
    onClose();
  };

  const leftItems: MenuItem[] = [
    { icon: '🌐', label: 'Développement Web', action: () => openApp('web-dev', 'Développement Web', '📁', 'FolderView', { folder: 'web' }) },
    { icon: '📱', label: 'Mobile & Apps', action: () => openApp('mobile-apps', 'Mobile & Apps', '📁', 'FolderView', { folder: 'mobile' }) },
    { icon: '🤖', label: 'Intelligence Artificielle', action: () => openApp('ai-auto', 'IA & Automatisation', '📁', 'FolderView', { folder: 'ai' }) },
    { icon: '🐳', label: 'DevOps & Cloud', action: () => openApp('devops', 'DevOps & Cloud', '📁', 'FolderView', { folder: 'devops' }) },
  ];

  const rightItems: MenuItem[] = [
    { icon: '🖥️', label: 'Poste de travail', action: () => openApp('my-computer', 'Poste de travail', '🖥️', 'FolderView', { folder: 'root' }) },
    { icon: '👤', label: 'À propos de moi', action: () => openApp('about-me', 'À propos de moi', '👤', 'AboutMe') },
    { icon: '🛠️', label: 'Compétences', action: () => openApp('skills', 'Compétences', '🛠️', 'Skills') },
    { icon: '📄', label: 'Mon CV', action: () => openApp('cv', 'Mon CV', '📄', 'CV') },
    { icon: '📧', label: 'Me contacter', action: () => openApp('contact', 'Me contacter', '📧', 'Contact') },
    { icon: '🌐', label: 'Mes Réseaux', action: () => openApp('social', 'Réseaux Sociaux', '🌐', 'SocialMedia') },
  ];

  const gameItems: MenuItem[] = [
    { icon: '🖌️', label: 'Paint', action: () => openApp('paint', 'Paint', '🖌️', 'Paint') },
    { icon: '🃏', label: 'Solitaire', action: () => openApp('solitaire', 'Solitaire', '🃏', 'Solitaire') },
    { icon: '💣', label: 'Démineur', action: () => openApp('minesweeper', 'Démineur', '💣', 'Minesweeper') },
    { icon: '🐍', label: 'Snake', action: () => openApp('snake', 'Snake', '🐍', 'Snake') },
    { icon: '🎮', label: 'Jeux PSX', action: () => openApp('retrogames', 'Jeux Rétro PSX', '🎮', 'RetroGames') },
  ];

  const MenuRow = ({ item }: { item: MenuItem }) => (
    <div
      className="xp-menu-item"
      onClick={item.action}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && item.action()}
      style={{ padding: '5px 10px', gap: 8, fontSize: 12 }}
    >
      <span style={{ fontSize: 15 }}>{item.icon}</span>
      <span>{item.label}</span>
    </div>
  );

  const SectionLabel = ({ label }: { label: string }) => (
    <div style={{ fontSize: 10, fontWeight: 'bold', color: '#666', padding: '4px 10px 2px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {label}
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9000 }} onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 10, scaleY: 0.95 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
        style={{
          transformOrigin: 'bottom left',
          position: 'fixed',
          bottom: 40,
          left: 0,
          zIndex: 9001,
          width: 420,
          background: 'white',
          border: '1px solid #0054E3',
          boxShadow: '4px 0 10px rgba(0,0,0,0.4)',
          borderRadius: '4px 4px 0 0',
          overflow: 'hidden',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        role="menu"
        aria-label="Menu Démarrer"
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(90deg, #1A4FC4 0%, #2563EB 100%)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={avatarImg}
            alt="digitalsolverland"
            style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ color: 'white', fontFamily: 'Tahoma, sans-serif', fontSize: 14, fontWeight: 'bold' }}>digitalsolverland</div>
            <div style={{ color: '#AAC8FF', fontFamily: 'Tahoma, sans-serif', fontSize: 11 }}>Ingénieure Full-Stack</div>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: 'flex', minHeight: 300 }}>
          {/* Left column — Projects + Games */}
          <div style={{ flex: 1, background: 'white', borderRight: '1px solid #D4D0C8', padding: '4px 0', overflow: 'auto' }}>
            <SectionLabel label="Projets" />
            {leftItems.map((item, i) => <MenuRow key={i} item={item} />)}
            <div
              className="xp-menu-item"
              role="menuitem"
              tabIndex={0}
              onClick={() => openApp('my-projects', 'Mes Projets', '📁', 'FolderView', { folder: 'projects' })}
              style={{ padding: '5px 10px', gap: 8, fontSize: 12 }}
            >
              <span style={{ fontSize: 15 }}>📂</span>
              <span>Tous mes projets</span>
            </div>

            <div className="xp-menu-separator" style={{ margin: '4px 8px' }} />
            <SectionLabel label="🎮 Divertissements" />
            {gameItems.map((item, i) => <MenuRow key={i} item={item} />)}
          </div>

          {/* Right column — Portfolio + Social */}
          <div style={{ flex: 1, background: '#D8E4F8', padding: '4px 0', overflow: 'auto' }}>
            <SectionLabel label="Portfolio" />
            {rightItems.map((item, i) => <MenuRow key={i} item={item} />)}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#D4D0C8', borderTop: '1px solid #ACA899', padding: '6px 8px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <div
            className="xp-menu-item"
            role="menuitem"
            tabIndex={0}
            onClick={() => { setPhase('login'); onClose(); }}
            style={{ padding: '4px 8px', gap: 6, fontSize: 12 }}
          >
            <span>🔒</span> Déconnecter
          </div>
          <div
            className="xp-menu-item"
            role="menuitem"
            tabIndex={0}
            onClick={() => { setPhase('shutdown'); onClose(); }}
            style={{ padding: '4px 8px', gap: 6, fontSize: 12, color: '#CC0000' }}
          >
            <span>🔴</span> Arrêter
          </div>
        </div>
      </motion.div>
    </>
  );
}
