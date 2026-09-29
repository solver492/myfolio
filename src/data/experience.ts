export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  startYear: number;
  endYear?: number;
  type: 'CDI' | 'Freelance' | 'Project' | 'Formation';
  description: string;
  technologies: string[];
  icon: string;
  color: string;
}

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Ingénieure Full-Stack & DevOps',
    company: 'Freelance / digitalsolverland',
    period: '2022 — Présent',
    startYear: 2022,
    type: 'Freelance',
    description: 'Développement de solutions web et mobiles complètes, infrastructures cloud self-hosted, agents IA et automatisation. Projets pour clients Maroc & international.',
    technologies: ['React', 'Node.js', 'Docker', 'Python', 'LLM', 'Supabase'],
    icon: '🚀',
    color: '#0054E3',
  },
  {
    id: 'exp-2',
    title: 'Développeuse Web Full-Stack',
    company: 'Agence Digitale',
    period: '2020 — 2022',
    startYear: 2020,
    endYear: 2022,
    type: 'CDI',
    description: 'Conception et développement d\'applications web pour des clients dans les secteurs immobilier, e-commerce et services. Gestion d\'équipes techniques et relation client.',
    technologies: ['React', 'PHP', 'MySQL', 'WordPress', 'SEO'],
    icon: '💼',
    color: '#3C9B3C',
  },
  {
    id: 'exp-3',
    title: 'Licence Informatique',
    company: 'Université',
    period: '2017 — 2020',
    startYear: 2017,
    endYear: 2020,
    type: 'Formation',
    description: 'Formation en génie logiciel, algorithmes, réseaux et systèmes. Projets de fin d\'études axés sur le développement web et les bases de données.',
    technologies: ['Java', 'C', 'SQL', 'Réseaux', 'Algorithmes'],
    icon: '🎓',
    color: '#8B6914',
  },
];
