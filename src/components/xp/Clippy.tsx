import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wiggle = {
  animate: {
    rotate: [0, -3, 3, -3, 0],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const },
  },
};

export function Clippy() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 10_000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            position: 'fixed',
            bottom: 52,
            right: 16,
            zIndex: 9000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          {/* Speech bubble */}
          {!answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'white',
                border: '2px solid #000',
                borderRadius: 8,
                padding: '12px 16px',
                maxWidth: 240,
                boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
                fontFamily: 'Tahoma, sans-serif',
                fontSize: 12,
                position: 'relative',
              }}
            >
              <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
                Il semblerait que vous visitiez un portfolio...<br />
                <strong>Voulez-vous que je vous aide à trouver les projets ?</strong>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="xp-btn"
                  style={{ fontSize: 11, minWidth: 40, height: 20 }}
                  onClick={() => setAnswered(true)}
                >
                  Oui !
                </button>
                <button
                  className="xp-btn"
                  style={{ fontSize: 11, minWidth: 40, height: 20 }}
                  onClick={() => setDismissed(true)}
                >
                  Non merci
                </button>
                <button
                  className="xp-btn"
                  style={{ fontSize: 11, minWidth: 40, height: 20 }}
                  onClick={() => setDismissed(true)}
                >
                  Fermer
                </button>
              </div>
              {/* Bubble tail */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -10,
                  right: 20,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '10px solid #000',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -8,
                  right: 21,
                  width: 0,
                  height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '9px solid white',
                }}
              />
            </motion.div>
          )}

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'white',
                border: '2px solid #000',
                borderRadius: 8,
                padding: '10px 14px',
                maxWidth: 220,
                fontFamily: 'Tahoma, sans-serif',
                fontSize: 11,
                lineHeight: 1.4,
              }}
            >
              💡 Double-cliquez sur les icônes du bureau pour ouvrir des projets !
              <br />
              <button
                className="xp-btn"
                style={{ fontSize: 10, height: 18, marginTop: 6 }}
                onClick={() => setDismissed(true)}
              >
                Merci !
              </button>
            </motion.div>
          )}

          {/* Clippy character */}
          <motion.div
            variants={wiggle}
            animate="animate"
            style={{ fontSize: 48, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setAnswered(false)}
            title="Cliquez sur Clippy"
            role="button"
            aria-label="Assistant Clippy"
          >
            📎
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
