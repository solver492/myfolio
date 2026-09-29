import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../../store/systemStore';
import { useSound } from '../../hooks/useSound';
import avatarImg from '../../assets/avatar.jpg';

export function LoginScreen() {
  const setPhase = useSystemStore((s) => s.setPhase);
  const { play } = useSound();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    play('startup');
    await new Promise((r) => setTimeout(r, 1800));
    setPhase('boot');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #1B3E8A 0%, #0A1F4E 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(180deg, #1E4FC8 0%, #0A2A80 100%)',
          borderBottom: '3px solid #2563EB',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 32 }}>🪟</div>
        <div>
          <div style={{ color: '#7FB3FF', fontSize: 11, fontFamily: 'Tahoma, sans-serif' }}>Microsoft</div>
          <div style={{ color: 'white', fontSize: 22, fontFamily: 'Tahoma, sans-serif', fontWeight: 'bold', letterSpacing: 1 }}>
            Windows <span style={{ color: '#FF9900' }}>XP</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Tahoma, sans-serif', textAlign: 'right' }}>
          Pour commencer, cliquez sur votre nom d'utilisateur
        </div>
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 32 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px #0054E3, 0 0 60px rgba(0,84,227,0.3)' }}
          style={{
            background: 'linear-gradient(180deg, rgba(30,79,200,0.6) 0%, rgba(10,30,100,0.8) 100%)',
            border: '1px solid rgba(100,150,255,0.4)',
            borderRadius: 8,
            padding: '32px 48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            minWidth: 280,
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
          }}
          onClick={handleLogin}
        >
          {/* Real avatar */}
          <motion.img
            src={avatarImg}
            alt="digitalsolverland"
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.5)',
              boxShadow: '0 0 20px rgba(0,100,255,0.4)',
              objectFit: 'cover',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,150,255,0.7)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          />

          <div style={{ color: 'white', fontSize: 18, fontFamily: 'Tahoma, sans-serif', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            digitalsolverland
          </div>
          <div style={{ color: '#AAC8FF', fontSize: 12, fontFamily: 'Tahoma, sans-serif' }}>
            Ingénieure Full-Stack
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="xp-input"
            style={{ width: '100%', marginTop: 8 }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            onClick={(e) => e.stopPropagation()}
            aria-label="Mot de passe (décoratif)"
          />

          <motion.button
            className="xp-btn"
            style={{
              background: 'linear-gradient(90deg, #54B054 0%, #3C9B3C 100%)',
              color: 'white',
              border: '1px solid #2A7A2A',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              justifyContent: 'center',
              height: 28,
              marginTop: 4,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); handleLogin(); }}
            aria-label="Se connecter"
          >
            {isLoggingIn ? '⏳ Connexion...' : '▶ Connexion'}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isLoggingIn && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
            >
              <div style={{ color: 'white', fontFamily: 'Tahoma, sans-serif', fontSize: 14 }}>
                Bienvenue, digitalsolverland...
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    style={{ width: 8, height: 8, background: '#2B8ADE', borderRadius: 1 }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0A2A80 0%, #061550 100%)',
          borderTop: '3px solid #2563EB',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          className="xp-btn"
          style={{ background: 'linear-gradient(180deg, #D43030 0%, #A02020 100%)', color: 'white', border: '1px solid #801010', display: 'flex', alignItems: 'center', gap: 6 }}
          aria-label="Arrêter l'ordinateur"
        >
          🔴 Arrêter l'ordinateur
        </button>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Tahoma, sans-serif' }}>
          © 2024 digitalsolverland
        </div>
      </div>
    </motion.div>
  );
}
