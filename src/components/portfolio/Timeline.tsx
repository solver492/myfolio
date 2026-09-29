import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { experiences } from '../../data/experience';

function TimelineItem({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        display: 'flex',
        gap: 12,
        marginBottom: 20,
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: exp.color,
          border: '3px solid white',
          boxShadow: `0 0 0 2px ${exp.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        {exp.icon}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          background: 'white',
          border: '1px solid #D4D0C8',
          padding: '10px 14px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h3 style={{ fontSize: 13, fontWeight: 'bold', color: '#0054E3' }}>{exp.title}</h3>
          <span
            className="xp-badge"
            style={{ fontSize: 10, flexShrink: 0, marginLeft: 8, background: exp.color, color: 'white', border: 'none' }}
          >
            {exp.type}
          </span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>{exp.company}</div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>{exp.period}</div>
        <p style={{ fontSize: 12, lineHeight: 1.5, color: '#333', marginBottom: 8 }}>
          {exp.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {exp.technologies.map((tech) => (
            <span key={tech} className="xp-badge" style={{ fontSize: 10 }}>{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  return (
    <div style={{ fontFamily: 'var(--xp-font)', height: '100%', overflow: 'auto', padding: 8 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          background: 'var(--xp-title-gradient)',
          color: 'white',
          padding: '4px 8px',
          marginBottom: 16,
        }}
      >
        📅 Parcours Professionnel
      </h2>

      {/* Timeline line */}
      <div style={{ position: 'relative', paddingLeft: 8 }}>
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, #0054E3, #3C9B3C, #8B6914)',
            zIndex: 0,
          }}
        />
        {experiences.map((exp, i) => (
          <TimelineItem key={exp.id} exp={exp} index={i} />
        ))}
      </div>
    </div>
  );
}
