import { motion } from 'framer-motion';
import { AuroraBackground } from '../ui/aurora-background';
import { skills, categories, type SkillCategory } from '../../data/skills';
import { useState } from 'react';

const CATEGORY_ICONS: Record<SkillCategory, string> = {
  Frontend:  '🎨',
  Backend:   '⚙️',
  DevOps:    '🐳',
  Database:  '🗄️',
  Mobile:    '📱',
  IA:        '🧠',
  Marketing: '📈',
};

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Frontend:  '#60a5fa',
  Backend:   '#34d399',
  DevOps:    '#fb923c',
  Database:  '#a78bfa',
  Mobile:    '#f472b6',
  IA:        '#facc15',
  Marketing: '#38bdf8',
};

export function SkillsAurora() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <AuroraBackground
      className="dark"
      showRadialGradient={true}
      style={{ height: '100%', minHeight: '100%' }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          padding: '32px 40px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textShadow: '0 0 30px rgba(99,179,237,0.8)',
              fontFamily: 'Tahoma, sans-serif',
              letterSpacing: 1,
            }}
          >
            ✨ Mes Compétences
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              marginTop: 8,
              fontSize: 13,
              fontFamily: 'Tahoma, sans-serif',
            }}
          >
            Stack technique & niveaux de maîtrise
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.3)',
              background: activeCategory === 'all'
                ? 'rgba(255,255,255,0.25)'
                : 'rgba(255,255,255,0.08)',
              color: 'white',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'Tahoma, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            🌐 Tout
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? CATEGORY_COLORS[cat] : 'rgba(255,255,255,0.2)'}`,
                background: activeCategory === cat
                  ? `${CATEGORY_COLORS[cat]}33`
                  : 'rgba(255,255,255,0.06)',
                color: activeCategory === cat ? CATEGORY_COLORS[cat] : 'rgba(255,255,255,0.75)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'Tahoma, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: '14px 18px',
              }}
            >
              {/* Skill header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{skill.icon}</span>
                  <span
                    style={{
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 'bold',
                      fontFamily: 'Tahoma, sans-serif',
                    }}
                  >
                    {skill.name}
                  </span>
                </div>
                <span
                  style={{
                    color: CATEGORY_COLORS[skill.category],
                    fontSize: 12,
                    fontFamily: 'Tahoma, sans-serif',
                    fontWeight: 'bold',
                  }}
                >
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 6,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ delay: i * 0.04 + 0.2, duration: 0.8, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${CATEGORY_COLORS[skill.category]}99, ${CATEGORY_COLORS[skill.category]})`,
                    borderRadius: 3,
                    boxShadow: `0 0 8px ${CATEGORY_COLORS[skill.category]}88`,
                  }}
                />
              </div>

              {/* Category badge */}
              <div style={{ marginTop: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    color: CATEGORY_COLORS[skill.category],
                    fontFamily: 'Tahoma, sans-serif',
                    opacity: 0.8,
                  }}
                >
                  {CATEGORY_ICONS[skill.category]} {skill.category}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: 11,
            marginTop: 32,
            fontFamily: 'Tahoma, sans-serif',
          }}
        >
          {skills.length} compétences · {categories.length} catégories
        </motion.p>
      </div>
    </AuroraBackground>
  );
}
