import { useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { useSystemStore } from '../store/systemStore';

type SoundKey = 'startup' | 'click' | 'error' | 'notify' | 'shutdown' | 'open' | 'close';

const SOUND_URLS: Record<SoundKey, string> = {
  startup:  '/sounds/startup.mp3',
  click:    '/sounds/click.mp3',
  error:    '/sounds/error.mp3',
  notify:   '/sounds/notify.mp3',
  shutdown: '/sounds/shutdown.mp3',
  open:     '/sounds/open.mp3',
  close:    '/sounds/close.mp3',
};

const soundCache = new Map<SoundKey, Howl>();

function getHowl(key: SoundKey): Howl {
  if (!soundCache.has(key)) {
    const howl = new Howl({
      src: [SOUND_URLS[key]],
      volume: 0.6,
      preload: true,
      html5: true,
    });
    soundCache.set(key, howl);
  }
  return soundCache.get(key)!;
}

export function useSound() {
  const isSoundEnabled = useSystemStore((s) => s.isSoundEnabled);
  const playingRef = useRef<Set<SoundKey>>(new Set());

  const play = useCallback(
    (key: SoundKey) => {
      if (!isSoundEnabled) return;
      if (playingRef.current.has(key)) return;
      try {
        const howl = getHowl(key);
        playingRef.current.add(key);
        howl.once('end', () => playingRef.current.delete(key));
        howl.once('playerror', () => playingRef.current.delete(key));
        howl.play();
      } catch {
        // Sound files may not exist in dev, fail silently
      }
    },
    [isSoundEnabled]
  );

  return { play };
}
