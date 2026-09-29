import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { projects, Project } from '../../data/projects';
import { useWindowStore } from '../../store/windowStore';

type FolderKey = 'root' | 'projects' | 'web' | 'mobile' | 'ai' | 'devops';

const FOLDER_TITLES: Record<FolderKey, string> = {
  root: 'Poste de travail',
  projects: 'Mes Projets',
  web: 'Développement Web',
  mobile: 'Mobile & Apps',
  ai: 'IA & Automatisation',
  devops: 'DevOps & Cloud',
};

const CATEGORY_MAP: Record<FolderKey, string | null> = {
  root: null,
  projects: null,
  web: 'Développement Web',
  mobile: 'Mobile & Apps',
  ai: 'IA & Automatisation',
  devops: 'DevOps & Cloud',
};

const ROOT_FOLDERS: Array<{ key: FolderKey; icon: string; label: string }> = [
  { key: 'projects', icon: '📁', label: 'Mes Projets' },
  { key: 'web', icon: '🌐', label: 'Développement Web' },
  { key: 'mobile', icon: '📱', label: 'Mobile & Apps' },
  { key: 'ai', icon: '🤖', label: 'IA & Automatisation' },
  { key: 'devops', icon: '🐳', label: 'DevOps & Cloud' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'tech' | 'links'>('general');

  return (
    <div style={{ fontFamily: 'var(--xp-font)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ACA899', paddingTop: 8, paddingLeft: 8 }}>
        {(['general', 'tech', 'links'] as const).map((tab) => (
          <button
            key={tab}
            className={`xp-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'general' ? 'Général' : tab === 'tech' ? 'Technologies' : 'Liens'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {activeTab === 'general' && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 48 }}>{project.icon}</div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{project.name}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="xp-badge">{project.category}</span>
                  <span
                    className="xp-badge"
                    style={{
                      background: project.status === 'Production' ? '#d4edda' : '#fff3cd',
                      color: project.status === 'Production' ? '#155724' : '#856404',
                    }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              {project.longDescription ?? project.description}
            </p>
          </div>
        )}

        {activeTab === 'tech' && (
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 12 }}>Stack technique</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.stack.map((tech) => (
                <motion.span
                  key={tech}
                  className="xp-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ fontSize: 12 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {project.live && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>🌐</span>
                <span style={{ fontSize: 13 }}>Live : </span>
                <span
                  style={{ fontSize: 13, color: '#0054E3', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => window.open(`https://${project.live}`, '_blank')}
                >
                  {project.live}
                </span>
              </div>
            )}
            {project.github && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>💻</span>
                <span style={{ fontSize: 13 }}>GitHub : </span>
                <span
                  style={{ fontSize: 13, color: '#0054E3', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => window.open(project.github, '_blank')}
                >
                  {project.github}
                </span>
              </div>
            )}
            {!project.live && !project.github && (
              <p style={{ fontSize: 13, color: '#666' }}>Aucun lien disponible pour ce projet.</p>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '8px 16px', borderTop: '1px solid #D4D0C8', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="xp-btn" onClick={onClose} autoFocus>
          Fermer
        </button>
      </div>
    </div>
  );
}

interface FolderViewProps {
  folder?: string;
}

export function FolderView({ folder = 'root' }: FolderViewProps) {
  const folderKey = (folder as FolderKey) in FOLDER_TITLES ? (folder as FolderKey) : 'root';
  const [currentFolder, setCurrentFolder] = useState<FolderKey>(folderKey);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [history, setHistory] = useState<FolderKey[]>([folderKey]);
  const [histIdx, setHistIdx] = useState(0);
  const openWindow = useWindowStore((s) => s.openWindow);

  const navigate = (key: FolderKey) => {
    const newHistory = [...history.slice(0, histIdx + 1), key];
    setHistory(newHistory);
    setHistIdx(newHistory.length - 1);
    setCurrentFolder(key);
    setSelectedProject(null);
  };

  const goBack = () => {
    if (histIdx > 0) {
      const prev = history[histIdx - 1];
      setHistIdx(histIdx - 1);
      setCurrentFolder(prev);
      setSelectedProject(null);
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      const next = history[histIdx + 1];
      setHistIdx(histIdx + 1);
      setCurrentFolder(next);
      setSelectedProject(null);
    }
  };

  const categoryFilter = CATEGORY_MAP[currentFolder];
  const filteredProjects =
    currentFolder === 'projects'
      ? projects
      : categoryFilter
      ? projects.filter((p) => p.category === categoryFilter)
      : [];

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--xp-font)' }}>
      {/* Address bar */}
      <div
        style={{
          background: '#D4D0C8',
          borderBottom: '1px solid #ACA899',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <button
          className="xp-btn"
          style={{ minWidth: 24, padding: '0 6px', fontSize: 14 }}
          onClick={goBack}
          disabled={histIdx === 0}
          aria-label="Précédent"
        >
          ←
        </button>
        <button
          className="xp-btn"
          style={{ minWidth: 24, padding: '0 6px', fontSize: 14 }}
          onClick={goForward}
          disabled={histIdx === history.length - 1}
          aria-label="Suivant"
        >
          →
        </button>
        <button
          className="xp-btn"
          style={{ minWidth: 24, padding: '0 6px', fontSize: 14 }}
          onClick={() => navigate('root')}
          aria-label="Monter"
        >
          ↑
        </button>
        <div
          style={{
            flex: 1,
            background: 'white',
            border: '1px solid #7F9DB9',
            padding: '2px 8px',
            fontSize: 12,
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          📁 {FOLDER_TITLES[currentFolder]}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panel */}
        <div
          style={{
            width: 180,
            background: '#EBF3FB',
            borderRight: '1px solid #D4D0C8',
            padding: '8px 4px',
            overflow: 'auto',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#0054E3', padding: '4px 8px', marginBottom: 4 }}>
            Dossiers
          </div>
          <div
            className={`xp-menu-item${currentFolder === 'root' ? ' selected' : ''}`}
            style={{ fontSize: 11, padding: '3px 8px' }}
            onClick={() => navigate('root')}
            role="treeitem"
          >
            🖥️ Poste de travail
          </div>
          {ROOT_FOLDERS.map((f) => (
            <div
              key={f.key}
              className="xp-menu-item"
              style={{
                fontSize: 11,
                padding: '3px 8px',
                paddingLeft: 20,
                background: currentFolder === f.key ? 'var(--xp-selected-blue)' : undefined,
                color: currentFolder === f.key ? 'var(--xp-selected-text)' : undefined,
              }}
              onClick={() => navigate(f.key)}
              role="treeitem"
              aria-selected={currentFolder === f.key}
            >
              {f.icon} {f.label}
            </div>
          ))}
          <div className="xp-menu-separator" />
          <div
            className="xp-menu-item"
            style={{ fontSize: 11, padding: '3px 8px' }}
            onClick={() =>
              openWindow({
                id: 'contact',
                title: 'Me contacter',
                icon: '📧',
                component: 'Contact',
                position: { x: 200, y: 120 },
                size: { width: 500, height: 520 },
                isMinimized: false,
                isMaximized: false,
              })
            }
          >
            📧 Contact
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: 12, overflow: 'auto' }}>
          {currentFolder === 'root' ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 100px)', gap: 12 }}
            >
              {ROOT_FOLDERS.map((f) => (
                <motion.div
                  key={f.key}
                  variants={itemVariants}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    padding: 8,
                    borderRadius: 2,
                  }}
                  whileHover={{ background: 'rgba(0,84,227,0.1)' }}
                  onDoubleClick={() => navigate(f.key)}
                >
                  <span style={{ fontSize: 36 }}>{f.icon}</span>
                  <span style={{ fontSize: 11, textAlign: 'center', fontFamily: 'var(--xp-font)' }}>
                    {f.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ fontSize: 12, color: '#666', padding: 20 }}>Ce dossier est vide.</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 100px)', gap: 12 }}
            >
              {filteredProjects.map((proj) => (
                <motion.div
                  key={proj.id}
                  variants={itemVariants}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    padding: 8,
                    borderRadius: 2,
                  }}
                  whileHover={{ background: 'rgba(0,84,227,0.1)' }}
                  onDoubleClick={() => setSelectedProject(proj)}
                >
                  <span style={{ fontSize: 36 }}>{proj.icon}</span>
                  <span
                    style={{
                      fontSize: 11,
                      textAlign: 'center',
                      fontFamily: 'var(--xp-font)',
                      lineHeight: 1.2,
                    }}
                  >
                    {proj.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          borderTop: '1px solid #ACA899',
          padding: '3px 8px',
          fontSize: 11,
          background: '#D4D0C8',
          fontFamily: 'var(--xp-font)',
        }}
      >
        {currentFolder !== 'root'
          ? `${filteredProjects.length} objet(s)`
          : `${ROOT_FOLDERS.length} dossiers`}
      </div>
    </div>
  );
}
