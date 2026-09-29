import React from 'react';
import { motion } from 'framer-motion';
import avatarImg from '../../assets/avatar.jpg';

export function AboutMe() {
  const infos = [
    { label: 'Nom', value: 'digitalsolverland' },
    { label: 'Rôle', value: 'Ingénieure Full-Stack & DevOps' },
    {
      label: 'Localisation',
      value: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          🌎 Planète Terre
          <span style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>
            (coordonnées GPS : quelque part entre le café et le clavier)
          </span>
        </span>
      ),
    },
    { label: 'Disponibilité', value: 'Remote-first 🌐 | Partout où il y a du WiFi' },
    { label: 'Spécialités', value: 'React, Node.js, Docker, IA/LLM' },
  ];

  return (
    <div style={{ fontFamily: 'var(--xp-font)', padding: 8 }}>
      {/* Header with real avatar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: 16, background: 'linear-gradient(135deg, #EBF3FB 0%, #D8E4F8 100%)', border: '1px solid #7F9DB9' }}>
        <motion.img
          src={avatarImg}
          alt="digitalsolverland"
          style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #0054E3', objectFit: 'cover', flexShrink: 0 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0,84,227,0.4)' }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 'bold', color: '#0054E3', marginBottom: 4 }}>
            digitalsolverland
          </h1>
          <p style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>
            Ingénieure en Informatique | Full-Stack | DevOps | IA
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['React', 'Node.js', 'Docker', 'Python', 'LLM'].map((t) => (
              <span key={t} className="xp-badge" style={{ fontSize: 10 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, fontWeight: 'bold', background: 'var(--xp-title-gradient)', color: 'white', padding: '4px 8px', marginBottom: 8 }}>
          👋 Bio
        </h2>
        <p style={{ fontSize: 13, lineHeight: 1.6, padding: '0 8px' }}>
          Passionnée par la technologie depuis toujours, je suis une ingénieure Full-Stack
          spécialisée dans la conception et le développement de solutions digitales complètes.
          De l'interface utilisateur à l'infrastructure cloud, je maîtrise l'ensemble de la chaîne technique.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, padding: '8px 8px 0' }}>
          Mes projets récents témoignent de ma passion pour l'IA et l'automatisation,
          avec des agents intelligents, des systèmes LLM self-hosted et des plateformes
          multi-boutiques équipées de modules d'analyse concurrentielle.
        </p>
      </div>

      {/* Info table */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, fontWeight: 'bold', background: 'var(--xp-title-gradient)', color: 'white', padding: '4px 8px', marginBottom: 8 }}>
          ℹ️ Informations
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <tbody>
            {infos.map((info) => (
              <tr key={info.label} style={{ borderBottom: '1px solid #D4D0C8' }}>
                <td style={{ padding: '6px 8px', fontWeight: 'bold', width: 130, background: '#EBF3FB', color: '#0054E3' }}>
                  {info.label}
                </td>
                <td style={{ padding: '6px 8px' }}>{info.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <motion.a
          href="https://github.com/solver492"
          target="_blank"
          rel="noopener noreferrer"
          className="xp-btn"
          style={{ textDecoration: 'none', color: 'inherit', fontSize: 12 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🐙 GitHub
        </motion.a>
        <motion.button className="xp-btn" style={{ fontSize: 12 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          📧 Contact
        </motion.button>
      </div>
    </div>
  );
}
