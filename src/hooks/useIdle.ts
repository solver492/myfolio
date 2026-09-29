import { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/systemStore';

const IDLE_TIMEOUT = 30_000; // 30 seconds

export function useIdle() {
  const { updateInteraction, setScreensaver, phase } = useSystemStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== 'desktop') return;

    const resetTimer = () => {
      updateInteraction();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setScreensaver(true);
      }, IDLE_TIMEOUT);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => document.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, updateInteraction, setScreensaver]);
}
