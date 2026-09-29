import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type ProjectCategory } from '../../data/projects';
import { ProjectCard } from './ProjectCard';

const CATEGORIES: Array<{ key: ProjectCategory | 'all'; label: string; icon: string }> = [
  { key: 'all', label: 'Tous', icon: '📂' },
  { key: 'Développement Web', label: 'Web', icon: '🌐' },
  { key: 'Mobile & Apps', label: 'Mobile', icon: '📱' },
  { key: 'IA & Automatisation', label: 'IA', icon: '🤖' },
  { key: 'DevOps & Cloud', label: 'DevOps', icon: '🐳' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div style={{ fontFamily: 'var(--xp-font)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          background: 'var(--xp-title-gradient)',
          color: 'white',
          padding: '4px 8px',
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        📁 Mes Projets
      </h2>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexShrink: 0, flexWrap: 'wrap' }}>
        {CATEGORIES.map(({ key, label, icon }) => (
          <button
            key={key}
            className="xp-tab"
            style={{
              fontSize: 11,
              background: activeCategory === key ? 'var(--xp-selected-blue)' : undefined,
              color: activeCategory === key ? 'white' : undefined,
              borderBottom: activeCategory === key ? 'none' : undefined,
            }}
            onClick={() => { setActiveCategory(key as ProjectCategory | 'all'); setSelectedId(null); }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <AnimatePresence mode="wait">
          {selectedId ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ height: '100%' }}
            >
              <button
                className="xp-btn"
                style={{ marginBottom: 8, fontSize: 11 }}
                onClick={() => setSelectedId(null)}
              >
                ← Retour
              </button>
              <ProjectCard project={projects.find((p) => p.id === selectedId)!} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 12,
              }}
            >
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: '2px 2px 6px rgba(0,0,0,0.2)' }}
                  style={{
                    background: 'white',
                    border: '1px solid #D4D0C8',
                    padding: 12,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => setSelectedId(project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedId(project.id)}
                  aria-label={`Projet: ${project.name}`}
                >
                  <div style={{ fontSize: 28, marginBottom: 6, textAlign: 'center' }}>{project.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#666', textAlign: 'center', marginBottom: 6 }}>
                    {project.category}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      textAlign: 'center',
                      padding: '2px 6px',
                      background: project.status === 'Production' ? '#d4edda' : '#fff3cd',
                      color: project.status === 'Production' ? '#155724' : '#856404',
                      border: `1px solid ${project.status === 'Production' ? '#c3e6cb' : '#ffeeba'}`,
                    }}
                  >
                    {project.status}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
