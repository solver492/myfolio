import React from 'react';
import { motion } from 'framer-motion';

interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  icon: string;
  color: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    handle: '@solver492',
    url: 'https://github.com/solver492',
    icon: '🐙',
    color: '#24292e',
    description: 'Code source & projets open-source',
  },
  {
    platform: 'Instagram',
    handle: '@digitalsolverland',
    url: 'https://instagram.com/digitalsolverland',
    icon: '📸',
    color: '#E1306C',
    description: 'Projets visuels & actualités',
  },
  {
    platform: 'LinkedIn',
    handle: 'digitalsolverland',
    url: 'https://linkedin.com/in/digitalsolverland',
    icon: '💼',
    color: '#0077B5',
    description: 'Profil professionnel & réseau',
  },
  {
    platform: 'TikTok',
    handle: '@digitalsolverland',
    url: 'https://tiktok.com/@digitalsolverland',
    icon: '🎵',
    color: '#010101',
    description: 'Contenu tech & tutoriels',
  },
  {
    platform: 'YouTube',
    handle: '@digitalsolverland',
    url: 'https://youtube.com/@digitalsolverland',
    icon: '▶️',
    color: '#FF0000',
    description: 'Vidéos & démonstrations projets',
  },
  {
    platform: 'Twitter / X',
    handle: '@digitalsolverland',
    url: 'https://x.com/digitalsolverland',
    icon: '🐦',
    color: '#1DA1F2',
    description: 'Tech news & updates',
  },
  {
    platform: 'Facebook',
    handle: 'digitalsolverland',
    url: 'https://facebook.com/digitalsolverland',
    icon: '👤',
    color: '#1877F2',
    description: 'Page communauté',
  },
];

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export function SocialMedia() {
  return (
    <div style={{ fontFamily: 'var(--xp-font)', padding: 8, height: '100%', overflow: 'auto' }}>
      <h2 style={{ fontSize: 13, fontWeight: 'bold', background: 'var(--xp-title-gradient)', color: 'white', padding: '4px 8px', marginBottom: 4 }}>
        🌐 Connexions Réseau — digitalsolverland
      </h2>
      <p style={{ fontSize: 11, color: '#666', marginBottom: 12, padding: '0 4px' }}>
        Etat : <span style={{ color: '#008000', fontWeight: 'bold' }}>● Connecté</span> — {socialLinks.length} réseaux actifs
      </p>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
      >
        {socialLinks.map((social) => (
          <motion.div
            key={social.platform}
            variants={itemVariants}
            style={{
              background: 'white',
              border: '1px solid #D4D0C8',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
            }}
          >
            {/* Platform icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                background: social.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {social.icon}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 1 }}>{social.platform}</div>
              <div style={{ fontSize: 11, color: '#0054E3', marginBottom: 1 }}>{social.handle}</div>
              <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {social.description}
              </div>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <motion.div
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#00AA00' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
              <span style={{ fontSize: 9, color: '#008000' }}>Connecté</span>
            </div>

            {/* Visit button */}
            <motion.a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="xp-btn"
              style={{ fontSize: 10, height: 22, textDecoration: 'none', color: 'inherit', flexShrink: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Visiter →
            </motion.a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
