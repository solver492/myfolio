import React from 'react';
import { skills, categories, type SkillCategory } from '../../data/skills';
import { experiences } from '../../data/experience';

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Frontend: '#0054E3',
  Backend: '#3C9B3C',
  DevOps: '#8B6914',
  Database: '#8B2090',
  Mobile: '#C04020',
  IA: '#1090A0',
  Marketing: '#804080',
};

export function CV() {
  const handlePrint = () => window.print();

  return (
    <div style={{ fontFamily: 'var(--xp-font)', height: '100%', overflow: 'auto', background: '#F5F5F5', padding: 8 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: '6px 8px', background: '#D4D0C8', border: '1px solid #ACA899' }}>
        <button className="xp-btn" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }} onClick={handlePrint}>
          🖨️ Imprimer
        </button>
        <button
          className="xp-btn"
          style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
          onClick={() => {
            const a = document.createElement('a');
            a.href = '/cv.pdf';
            a.download = 'CV-digitalsolverland.pdf';
            a.click();
          }}
        >
          💾 Télécharger PDF
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#666', alignSelf: 'center' }}>CV - digitalsolverland.pdf</span>
      </div>

      {/* CV content */}
      <div style={{ background: 'white', border: '1px solid #D4D0C8', boxShadow: '2px 2px 6px rgba(0,0,0,0.15)', padding: '32px 40px', maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ borderBottom: '3px solid #0054E3', paddingBottom: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#0054E3', marginBottom: 4 }}>digitalsolverland</h1>
            <h2 style={{ fontSize: 14, color: '#444', fontWeight: 'normal', marginBottom: 8 }}>Ingénieure Full-Stack & DevOps</h2>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
              📧 contact@digitalsolverland.dev<br />
              🌐 digitalsolverland.dev<br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                🌎 Planète Terre
                <span style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>
                  (coordonnées GPS : quelque part entre le café et le clavier)
                </span>
              </span>
            </div>
          </div>
          <div style={{ fontSize: 52 }}>👩‍💻</div>
        </div>

        {/* Info rapide */}
        <div style={{ marginBottom: 20, padding: '10px 14px', background: '#EBF3FB', border: '1px solid #7F9DB9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: 12 }}>
            <div><strong style={{ color: '#0054E3' }}>Résidence :</strong> 🌎 Planète Terre — Coordonnées confidentielles</div>
            <div><strong style={{ color: '#0054E3' }}>Disponibilité :</strong> Remote-first 🌐 | Disponible partout où il y a du WiFi</div>
            <div><strong style={{ color: '#0054E3' }}>Type :</strong> Freelance & Projets</div>
            <div><strong style={{ color: '#0054E3' }}>Fuseau horaire :</strong> UTC±∞ (selon le projet)</div>
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 'bold', color: 'white', background: '#0054E3', padding: '4px 10px', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            🛠️ Compétences Techniques
          </h3>
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: CATEGORY_COLORS[cat], marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {cat}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {catSkills.map((s) => (
                    <span
                      key={s.name}
                      style={{
                        fontSize: 11, padding: '2px 8px',
                        background: `${CATEGORY_COLORS[cat]}15`,
                        border: `1px solid ${CATEGORY_COLORS[cat]}40`,
                        color: CATEGORY_COLORS[cat],
                        fontFamily: 'var(--xp-font)',
                      }}
                    >
                      {s.name} ({s.level}%)
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 'bold', color: 'white', background: '#0054E3', padding: '4px 10px', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            💼 Expériences
          </h3>
          {experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16, paddingLeft: 12, borderLeft: `3px solid ${exp.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <strong style={{ fontSize: 13 }}>{exp.title}</strong>
                <span style={{ fontSize: 11, color: '#666' }}>{exp.period}</span>
              </div>
              <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>{exp.company}</div>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: '#555', marginBottom: 6 }}>{exp.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {exp.technologies.map((tech) => (
                  <span key={tech} style={{ fontSize: 10, padding: '1px 6px', background: `${exp.color}15`, border: `1px solid ${exp.color}40`, color: exp.color }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #D4D0C8', paddingTop: 12, fontSize: 10, color: '#999', textAlign: 'center' }}>
          digitalsolverland — Ingénieure Full-Stack & DevOps — {new Date().getFullYear()} — 🌎 Planète Terre
        </div>
      </div>
    </div>
  );
}
