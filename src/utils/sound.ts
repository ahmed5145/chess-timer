import { useCallback } from 'react';
import { Howl } from 'howler';

// Sound URLs from a reliable CDN
const SOUNDS = {
  click: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
    volume: 0.5,
  }),
  switch: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
    volume: 0.6,
  }),
  lowTime: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'],
    volume: 0.7,
    sprite: {
      beep: [0, 200],
    },
  }),
  timeUp: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'],
    volume: 0.8,
  }),
  gameStart: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'],
    volume: 0.7,
  }),
  gameEnd: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'],
    volume: 0.7,
  }),
} as const;

export type SoundEffect = keyof typeof SOUNDS;

export const useSound = (isMuted: boolean = false) => {
  const playSound = useCallback((sound: SoundEffect) => {
    if (isMuted) return;

    const howl = SOUNDS[sound];
    if (sound === 'lowTime') {
      howl.play('beep');
    } else {
      howl.play();
    }
  }, [isMuted]);

  return { playSound };
};

// Volume control
export const setVolume = (volume: number) => {
  const normalizedVolume = Math.max(0, Math.min(1, volume));
  Object.values(SOUNDS).forEach(howl => {
    howl.volume(normalizedVolume);
  });
}; 