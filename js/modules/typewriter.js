import { playTypewriterKeySound, playTypewriterBellSound } from '../audio.js';

export function handleTypewriterInput(e) {
  playTypewriterKeySound();
}

export function handleTypewriterKeydown(e) {
  if (e.key === 'Enter') {
    playTypewriterBellSound();
  }
}