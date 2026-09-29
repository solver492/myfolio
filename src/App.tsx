import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSystemStore } from './store/systemStore';
import { LoginScreen } from './components/xp/LoginScreen';
import { BootScreen } from './components/xp/BootScreen';
import { Desktop } from './components/xp/Desktop';

function ShutdownScreen() {
  const setPhase = useSystemStore((s) => s.setPhase);

  React.useEffect(() => {
    const timer = setTimeout(() => setPhase('login'), 3000);
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
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        color: 'white',
        fontFamily: 'Tahoma, sans-serif',
      }}
    >
      <div style={{ fontSize: 48 }}>🔴</div>
      <div style={{ fontSize: 16 }}>Arrêt en cours...</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        Il est maintenant sûr d'arrêter votre ordinateur.
      </div>
    </motion.div>
  );
}

export default function App() {
  const phase = useSystemStore((s) => s.phase);

  return (
    <AnimatePresence mode="wait">
      {phase === 'login' && (
        <motion.div key="login" style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
          <LoginScreen />
        </motion.div>
      )}
      {phase === 'boot' && (
        <motion.div key="boot" style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
          <BootScreen />
        </motion.div>
      )}
      {phase === 'desktop' && (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', inset: 0, zIndex: 1 }}
        >
          <Desktop />
        </motion.div>
      )}
      {phase === 'shutdown' && (
        <motion.div key="shutdown" style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
          <ShutdownScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
