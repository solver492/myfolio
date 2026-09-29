import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogBoxProps {
  isOpen: boolean;
  title: string;
  icon?: string;
  message: string;
  buttons?: Array<{ label: string; onClick: () => void; primary?: boolean }>;
  onClose: () => void;
}

export function DialogBox({ isOpen, title, icon = '⚠️', message, buttons, onClose }: DialogBoxProps) {
  const defaultButtons = buttons ?? [{ label: 'OK', onClick: onClose, primary: true }];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 15000,
            }}
            onClick={onClose}
          />
          <motion.div
            className="xp-dialog-overlay"
            style={{ zIndex: 15001 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="xp-dialog"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-message"
            >
              {/* Title bar */}
              <div className="xp-titlebar">
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span className="xp-titlebar-title" id="dialog-title">
                  {title}
                </span>
                <button
                  className="xp-titlebar-btn xp-titlebar-btn-close"
                  onClick={onClose}
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{icon}</span>
                <p
                  id="dialog-message"
                  style={{
                    fontFamily: 'var(--xp-font)',
                    fontSize: 'var(--xp-font-size-md)',
                    lineHeight: 1.5,
                  }}
                >
                  {message}
                </p>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '8px 20px 16px',
                  borderTop: '1px solid #ACA899',
                }}
              >
                {defaultButtons.map((btn, i) => (
                  <button
                    key={i}
                    className="xp-btn"
                    onClick={btn.onClick}
                    autoFocus={btn.primary}
                    style={btn.primary ? { fontWeight: 'bold', border: '2px solid #000' } : {}}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
