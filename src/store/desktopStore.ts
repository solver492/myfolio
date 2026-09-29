import { create } from 'zustand';

export interface DesktopIconState {
  id: string;
  label: string;
  icon: string;
  position: { x: number; y: number };
  isSelected: boolean;
  component: string;
  props?: Record<string, unknown>;
}

interface DesktopStore {
  icons: DesktopIconState[];
  selectedIconId: string | null;
  contextMenuPos: { x: number; y: number } | null;
  contextMenuTarget: string | null;
  selectIcon: (id: string | null) => void;
  moveIcon: (id: string, position: { x: number; y: number }) => void;
  setContextMenu: (pos: { x: number; y: number } | null, targetId?: string | null) => void;
  refreshIcons: () => void;
}

const DEFAULT_ICONS: DesktopIconState[] = [
  { id: 'my-computer', label: 'Poste de travail', icon: '🖥️', position: { x: 20, y: 20 }, isSelected: false, component: 'FolderView', props: { folder: 'root' } },
  { id: 'my-projects', label: 'Mes Projets', icon: '📁', position: { x: 20, y: 110 }, isSelected: false, component: 'FolderView', props: { folder: 'projects' } },
  { id: 'web-dev', label: 'Développement Web', icon: '📁', position: { x: 20, y: 200 }, isSelected: false, component: 'FolderView', props: { folder: 'web' } },
  { id: 'mobile-apps', label: 'Mobile & Apps', icon: '📁', position: { x: 20, y: 290 }, isSelected: false, component: 'FolderView', props: { folder: 'mobile' } },
  { id: 'ai-auto', label: 'IA & Automatisation', icon: '📁', position: { x: 20, y: 380 }, isSelected: false, component: 'FolderView', props: { folder: 'ai' } },
  { id: 'devops', label: 'DevOps & Cloud', icon: '📁', position: { x: 20, y: 470 }, isSelected: false, component: 'FolderView', props: { folder: 'devops' } },
  { id: 'cv', label: 'Mon CV', icon: '📄', position: { x: 110, y: 20 }, isSelected: false, component: 'CV', props: {} },
  { id: 'internet-explorer', label: 'Internet Explorer', icon: '🌐', position: { x: 110, y: 110 }, isSelected: false, component: 'InternetExplorer', props: {} },
  { id: 'recycle-bin', label: 'Corbeille', icon: '🗑️', position: { x: 110, y: 200 }, isSelected: false, component: 'RecycleBin', props: {} },
  { id: 'contact', label: 'Me Contacter', icon: '📧', position: { x: 110, y: 290 }, isSelected: false, component: 'Contact', props: {} },
];

export const useDesktopStore = create<DesktopStore>((set) => ({
  icons: DEFAULT_ICONS,
  selectedIconId: null,
  contextMenuPos: null,
  contextMenuTarget: null,

  selectIcon: (id) =>
    set((state) => ({
      selectedIconId: id,
      icons: state.icons.map((icon) => ({
        ...icon,
        isSelected: icon.id === id,
      })),
    })),

  moveIcon: (id, position) =>
    set((state) => ({
      icons: state.icons.map((icon) =>
        icon.id === id ? { ...icon, position } : icon
      ),
    })),

  setContextMenu: (pos, targetId = null) =>
    set({ contextMenuPos: pos, contextMenuTarget: targetId }),

  refreshIcons: () =>
    set((state) => ({ icons: [...state.icons] })),
}));
