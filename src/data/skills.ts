export type SkillCategory = 'Frontend' | 'Backend' | 'DevOps' | 'Database' | 'Mobile' | 'IA' | 'Marketing';

export interface Skill {
  name: string;
  level: number;
  category: SkillCategory;
  icon?: string;
}

export const skills: Skill[] = [
  { name: 'React / Next.js',  level: 92, category: 'Frontend',  icon: '⚛️' },
  { name: 'TypeScript',       level: 88, category: 'Frontend',  icon: '📘' },
  { name: 'Node.js',          level: 88, category: 'Backend',   icon: '🟢' },
  { name: 'Python',           level: 85, category: 'Backend',   icon: '🐍' },
  { name: 'PHP',              level: 80, category: 'Backend',   icon: '🐘' },
  { name: 'Docker',           level: 87, category: 'DevOps',    icon: '🐳' },
  { name: 'Cloudflare',       level: 85, category: 'DevOps',    icon: '☁️' },
  { name: 'Nginx',            level: 82, category: 'DevOps',    icon: '🔧' },
  { name: 'Supabase',         level: 82, category: 'Database',  icon: '💚' },
  { name: 'MongoDB',          level: 78, category: 'Database',  icon: '🍃' },
  { name: 'React Native',     level: 78, category: 'Mobile',    icon: '📱' },
  { name: 'Android / Kotlin', level: 75, category: 'Mobile',    icon: '🤖' },
  { name: 'IA / LLM',        level: 80, category: 'IA',        icon: '🧠' },
  { name: 'Prompt Engineering', level: 88, category: 'IA',     icon: '✨' },
  { name: 'SEO',              level: 75, category: 'Marketing', icon: '📈' },
];

export const skillsByCategory = skills.reduce<Record<SkillCategory, Skill[]>>(
  (acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  },
  {} as Record<SkillCategory, Skill[]>
);

export const categories: SkillCategory[] = [
  'Frontend', 'Backend', 'DevOps', 'Database', 'Mobile', 'IA', 'Marketing',
];
