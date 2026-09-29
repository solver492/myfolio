import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface RetroGame {
  id: string;
  name: string;
  icon: string;
  url: string;
  description: string;
}

const retroGames: RetroGame[] = [
  {
    id: 'mgs',
    name: 'Metal Gear Solid',
    icon: '🐍',
    url: 'https://www.retrogames.onl/2022/10/metal-gear-solid-ps1-play-online.html',
    description: 'Infiltration tactique — PS1',
  },
  {
    id: 'spyro',
    name: 'Spyro The Dragon',
    icon: '🐉',
    url: 'https://www.retrogames.onl/',
    description: 'Plateforme aventure — PS1',
  },
  {
    id: 'crash',
    name: 'Crash Bandicoot',
    icon: '🦘',
    url: 'https://www.retrogames.onl/',
    description: 'Plateforme action — PS1',
  },
  {
    id: 'ff7',
    name: 'Final Fantasy VII',
    icon: '⚔️',
    url: 'https://www.retrogames.onl/',
    description: 'RPG légendaire — PS1',
  },
  {
    id: 'tekken',
    name: 'Tekken 3',
    icon: '🥊',
    url: 'https://www.retrogames.onl/',
    description: 'Combat — PS1',
  },
  {
    id: 'castlevania',
    name: 'Castlevania SotN',
    icon: '🏰',
    url: 'https://www.retrogames.onl/',
    description: 'Action RPG — PS1',
  },
];

export function RetroGames() {
  const [selectedGame, setSelectedGame] = useState<RetroGame | null>(null);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedGame) return;
    setIframeBlocked(false);
    setIframeLoaded(false);
    timerRef.current = setTimeout(() => {
      if (!iframeLoaded) setIframeBlocked(true);
    }, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [selectedGame, iframeLoaded]);

  const handleLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIframeLoaded(true);
    setIframeBlocked(false);
  };

  if (selectedGame) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0A0A1A', fontFamily: 'var(--xp-font)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#111', borderBottom: '1px solid #333' }}>
          <button
            className="xp-btn"
            style={{ fontSize: 10, height: 20, padding: '0 8px' }}
            onClick={() => { setSelectedGame(null); setIframeBlocked(false); }}
          >
            ← Retour
          </button>
          <span style={{ fontSize: 14, color: 'white' }}>{selectedGame.icon} {selectedGame.name}</span>
          <button
            className="xp-btn"
            style={{ fontSize: 10, height: 20, padding: '0 8px', marginLeft: 'auto' }}
            onClick={() => window.open(selectedGame.url, '_blank')}
          >
            ↗ Ouvrir onglet
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, position: 'relative' }}>
          {!iframeBlocked ? (
            <iframe
              src={selectedGame.url}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              onLoad={handleLoad}
              title={selectedGame.name}
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : null}

          {iframeBlocked && (
            <div style={{
              position: 'absolute', inset: 0,
              background: '#0A0A1A',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ fontSize: 48 }}>{selectedGame.icon}</div>
              <div style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{selectedGame.name}</div>
              <div style={{ color: '#888', fontSize: 12, textAlign: 'center', maxWidth: 300 }}>
                Ce jeu ne peut pas être chargé dans une iframe en raison des restrictions de sécurité.
              </div>
              <motion.a
                href={selectedGame.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(90deg, #0044AA, #0066CC)',
                  color: 'white', padding: '8px 20px', borderRadius: 4,
                  textDecoration: 'none', fontSize: 13, fontWeight: 'bold',
                  border: '1px solid #0055BB',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎮 Ouvrir dans un nouvel onglet →
              </motion.a>
            </div>
          )}

          {!iframeBlocked && !iframeLoaded && (
            <div style={{
              position: 'absolute', inset: 0, background: '#0A0A1A',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ fontSize: 48 }}>{selectedGame.icon}</div>
              <div style={{ color: 'white', fontSize: 14 }}>Chargement de {selectedGame.name}...</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div key={i} style={{ width: 8, height: 8, background: '#0066CC', borderRadius: 1 }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--xp-font)', padding: 12, background: '#0A0A1A', minHeight: '100%' }}>
      <h2 style={{ color: '#FFD700', fontSize: 16, marginBottom: 4, textAlign: 'center' }}>
        🎮 Jeux Rétro PSX
      </h2>
      <p style={{ color: '#666', fontSize: 11, textAlign: 'center', marginBottom: 16 }}>
        Double-cliquez sur un jeu pour jouer
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        {retroGames.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0,100,200,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedGame(game)}
            style={{
              background: 'linear-gradient(135deg, #111 0%, #1A1A2E 100%)',
              border: '1px solid #333',
              borderRadius: 6,
              padding: '16px 12px',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              textAlign: 'center',
            }}
            role="button"
            tabIndex={0}
            aria-label={`Jouer à ${game.name}`}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedGame(game)}
          >
            <div style={{ fontSize: 36 }}>{game.icon}</div>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 'bold', lineHeight: 1.3 }}>{game.name}</div>
            <div style={{ color: '#888', fontSize: 10 }}>{game.description}</div>
            <div style={{ background: '#CC0000', color: 'white', fontSize: 9, padding: '2px 8px', borderRadius: 10, fontWeight: 'bold' }}>
              PlayStation
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
