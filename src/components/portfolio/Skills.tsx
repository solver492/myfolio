import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { skills, categories, type SkillCategory } from '../../data/skills';

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Frontend:  '#0054E3',
  Backend:   '#3C9B3C',
  DevOps:    '#8B6914',
  Database:  '#8B2090',
  Mobile:    '#C04020',
  IA:        '#1090A0',
  Marketing: '#804080',
};

function SkillBar({ name, level, icon, color, delay }: {
  name: string; level: number; icon?: string; color: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <div ref={ref} style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon && <span>{icon}</span>}
          <span style={{ fontFamily: 'var(--xp-font)', fontWeight: 'bold' }}>{name}</span>
        </span>
        <span style={{ color: '#666', fontFamily: 'var(--xp-font)' }}>{level}%</span>
      </div>
      <div className="xp-progress-container">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            type: 'spring',
            stiffness: 60,
            damping: 15,
            delay,
          }}
          style={{
            height: '100%',
            background: `linear-gradient(180deg, ${color}CC 0%, ${color} 50%, ${color}CC 100%)`,
            border: `1px solid ${color}`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
          aria-valuenow={level}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label={`Compétence ${name}: ${level}%`}
        />
      </div>
    </div>
  );
}

export function Skills() {
  const [activeCategory, setActiveCategory] = React.useState<SkillCategory | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <div style={{ fontFamily: 'var(--xp-font)', height: '100%', overflow: 'auto', padding: 8 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          background: 'var(--xp-title-gradient)',
          color: 'white',
          padding: '4px 8px',
          marginBottom: 12,
        }}
      >
        🛠️ Compétences Techniques
      </h2>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
        <button
          className="xp-btn"
          style={{
            fontSize: 10,
            height: 20,
            background: activeCategory === 'all' ? 'var(--xp-selected-blue)' : undefined,
            color: activeCategory === 'all' ? 'white' : undefined,
          }}
          onClick={() => setActiveCategory('all')}
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className="xp-btn"
            style={{
              fontSize: 10,
              height: 20,
              background: activeCategory === cat ? CATEGORY_COLORS[cat] : undefined,
              color: activeCategory === cat ? 'white' : undefined,
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills */}
      <div>
        {filtered.map((skill, i) => (
          <SkillBar
            key={skill.name}
            {...skill}
            color={CATEGORY_COLORS[skill.category]}
            delay={i * 0.08}
          />
        ))}
      </div>
    </div>
  );
}
