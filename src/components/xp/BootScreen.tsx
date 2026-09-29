import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/systemStore';

const loadingDots = Array.from({ length: 8 });

export function BootScreen() {
  const setPhase = useSystemStore((s) => s.setPhase);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('desktop');
    }, 2800);
    return () => clearTimeout(timer);
  }, [setPhase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      {/* Windows XP Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ textAlign: 'center' }}
      >
        <motion.div
          animate={{
            textShadow: [
              '0 0 10px #0054E3',
              '0 0 30px #0054E3, 0 0 60px #0054E3',
              '0 0 10px #0054E3',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 80 }}
        >
          🪟
        </motion.div>
        <div
          style={{
            color: 'white',
            fontFamily: 'Tahoma, sans-serif',
            fontSize: 28,
            fontWeight: 'bold',
            marginTop: 8,
          }}
        >
          Windows{' '}
          <span style={{ color: '#FF9900' }}>XP</span>
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'Tahoma, sans-serif',
            fontSize: 12,
            marginTop: 4,
          }}
        >
          Édition Professionnelle
        </div>
      </motion.div>

      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          color: 'white',
          fontFamily: 'Tahoma, sans-serif',
          fontSize: 20,
          fontWeight: '300',
          letterSpacing: 4,
        }}
      >
        Bienvenue
      </motion.div>

      {/* Loading dots - stagger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ display: 'flex', gap: 6 }}
        aria-label="Chargement en cours"
        role="progressbar"
      >
        {loadingDots.map((_, i) => (
          <motion.div
            key={i}
            className="xp-loading-dot"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
