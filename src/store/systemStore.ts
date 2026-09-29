import { create } from 'zustand';

export type SystemPhase = 'login' | 'boot' | 'desktop' | 'shutdown';

interface SystemStore {
  phase: SystemPhase;
  isSoundEnabled: boolean;
  isScreensaverActive: boolean;
  lastInteraction: number;
  isBSOD: boolean;
  setPhase: (phase: SystemPhase) => void;
  toggleSound: () => void;
  updateInteraction: () => void;
  setScreensaver: (active: boolean) => void;
  triggerBSOD: () => void;
  dismissBSOD: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  phase: 'login',
  isSoundEnabled: true,
  isScreensaverActive: false,
  lastInteraction: Date.now(),
  isBSOD: false,

  setPhase: (phase) => set({ phase }),

  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  updateInteraction: () =>
    set({ lastInteraction: Date.now(), isScreensaverActive: false }),

  setScreensaver: (active) => set({ isScreensaverActive: active }),

  triggerBSOD: () => set({ isBSOD: true }),
  dismissBSOD: () => set({ isBSOD: false }),
}));
