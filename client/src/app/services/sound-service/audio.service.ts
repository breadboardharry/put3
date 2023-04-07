import { Injectable } from '@angular/core';
import { SoundLoop } from 'src/app/interfaces/sound-loop';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  async play(src: string, loop: SoundLoop | null = null): Promise<void> {
    let rep = 0;

    do {
      await this.playAudio(src);
    }
    while (loop !== null && loop.enable && (!('reps' in loop) || ++rep < loop.reps!));
  }

  private playAudio(src: string): Promise<void> {
    let audio = new Audio(src);

    return new Promise<void>((resolve) => {
      audio.load();
      audio.play();
      audio.addEventListener('ended', () => {
        console.log('done');
        resolve();
      });
    })
  }
}
