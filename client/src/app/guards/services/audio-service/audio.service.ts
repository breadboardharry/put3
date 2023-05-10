import { Injectable } from '@angular/core';
import { SoundLoop } from 'src/app/interfaces/sound-loop';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private _audios: HTMLAudioElement[] = [];

  constructor() { }

  public async play(src: string, volume: number = 1.0, loop: SoundLoop | null = null): Promise<void> {
    let rep = 0;

    do {
      await this.playAudio(src, volume);
    }
    while (loop !== null && loop.enable && (!('reps' in loop) || ++rep < loop.reps!));
  }

  private playAudio(src: string, volume: number = 1.0): Promise<void> {
    let audio = new Audio(src);

    return new Promise<void>((resolve) => {
      audio.load();
      audio.volume = volume;
      audio.play();
      this._audios.push(audio);

      audio.addEventListener('ended', () => {
        resolve();
      });
    })
  }

  public stopAll(): void {
    for(let audio of this._audios) {
      audio.pause();
    }
  }
}
