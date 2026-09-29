import { create } from 'zustand';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string;
  props?: Record<string, unknown>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowStore {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (config: Omit<WindowState, 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, pos: { x: number; y: number }) => void;
  updateSize: (id: string, size: { width: number; height: number }) => void;
}

let zIndexCounter = 100;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (config) => {
    const existing = get().windows.find((w) => w.id === config.id);
    if (existing) {
      // Focus and restore if already open
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === config.id
            ? { ...w, isMinimized: false, zIndex: ++zIndexCounter }
            : w
        ),
        activeWindowId: config.id,
      }));
      return;
    }
    const newWindow: WindowState = {
      ...config,
      zIndex: ++zIndexCounter,
    };
    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: config.id,
    }));
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId:
        state.activeWindowId === id
          ? (state.windows.filter((w) => w.id !== id).at(-1)?.id ?? null)
          : state.activeWindowId,
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
      activeWindowId:
        state.activeWindowId === id ? null : state.activeWindowId,
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    })),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: ++zIndexCounter } : w
      ),
      activeWindowId: id,
    })),

  updatePosition: (id, pos) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position: pos } : w
      ),
    })),

  updateSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    })),
}));
