import React from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/systemStore';

export function BSOD() {
  const dismissBSOD = useSystemStore((s) => s.dismissBSOD);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        dismissBSOD();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [dismissBSOD]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="xp-bsod"
      onClick={dismissBSOD}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0000AA',
        color: 'white',
        fontFamily: 'Courier New, monospace',
        fontSize: 14,
        padding: '40px 60px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      role="alertdialog"
      aria-label="Blue Screen of Death - Cliquez pour fermer"
    >
      <p style={{ fontSize: 18, marginBottom: 24, background: '#AAAAAA', color: '#0000AA', padding: '2px 8px', display: 'inline-block' }}>
        ⚠️ Un problème a été détecté
      </p>
      <br />
      <p style={{ marginBottom: 16 }}>
        Windows a été arr♥té pour éviter d'endommager votre ordinateur.{' '}<br />
        Il semblerait que vous ayez cliqué sur quelque chose de dangereux.<br /><br />
        Ce portfolio est tellement impressionnant qu'il a fait planter le système.
      </p>
      <p style={{ marginBottom: 16 }}>
        <strong>PORTFOLIO_OVERLOADED_BY_AWESOMENESS</strong>
      </p>
      <p>
        Si c'est la première fois que vous voyez cet écran, relisez tout le portfolio.<br />
        Vérifiez que vous avez bien noté tous les projets.<br /><br />
        Informations techniques :<br />
        *** STOP: 0x0000HIRE (0xDIGITALSOLVER, 0xLAND, 0x00000001, 0xFULL_STACK)<br /><br />
        Collecte des informations pour le rapport d'erreur... 100%<br />
        Retour au portfolio dans quelques secondes...<br /><br />
        <em style={{ fontSize: 12, opacity: 0.8 }}>Cliquez n'importe où ou appuyez sur Entrée pour continuer</em>
      </p>
    </motion.div>
  );
}
