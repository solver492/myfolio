import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { type Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'tech' | 'links'>('general');

  return (
    <div style={{ fontFamily: 'var(--xp-font)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--xp-selected-blue)', marginBottom: 12 }}>
        {(['general', 'tech', 'links'] as const).map((tab) => (
          <button
            key={tab}
            className={`xp-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ fontSize: 11 }}
          >
            {tab === 'general' ? 'Général' : tab === 'tech' ? 'Technologies' : 'Liens'}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <motion.div
          style={{ fontSize: 48 }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {project.icon}
        </motion.div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 'bold', color: '#0054E3', marginBottom: 4 }}>
            {project.name}
          </h2>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="xp-badge" style={{ fontSize: 10 }}>{project.category}</span>
            <span
              className="xp-badge"
              style={{
                fontSize: 10,
                background: project.status === 'Production' ? '#d4edda' : '#fff3cd',
                color: project.status === 'Production' ? '#155724' : '#856404',
              }}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'general' && (
          <div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              {project.longDescription ?? project.description}
            </p>
          </div>
        )}

        {activeTab === 'tech' && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>Stack technique</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="xp-badge"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ fontSize: 12 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {project.live && (
              <motion.button
                className="xp-btn"
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(`https://${project.live}`, '_blank')}
              >
                🌐 Voir en ligne
              </motion.button>
            )}
            {project.github && (
              <motion.button
                className="xp-btn"
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(project.github, '_blank')}
              >
                💻 GitHub
              </motion.button>
            )}
            {!project.live && !project.github && (
              <p style={{ fontSize: 13, color: '#666' }}>Aucun lien disponible pour ce projet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
