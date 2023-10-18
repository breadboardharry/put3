import { Injectable } from '@angular/core';
import { SoundLoop } from 'src/app/interfaces/sound-loop';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private _audios: HTMLAudioElement[] = [];

    constructor() { }

    public play(src: string, volume: number = 1.0, loop?: SoundLoop): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let rep = 0;

            do {
                await new Promise<void>((resolve) => {
                    this.playAudio(src, volume).then(() => {
                        resolve();
                    }).catch((e) => {
                        reject(e);
                    });
                });
            }
            while (loop !== undefined && loop.enable && (!('reps' in loop) || ++rep < loop.reps!));
            resolve();
        });
    }

    private playAudio(src: string, volume: number = 1.0): Promise<void> {
        const audio = new Audio(src);
        this._audios.push(audio);

        return new Promise<void>((resolve, reject) => {
            audio.load();
            audio.volume = volume;
            audio.onended = () => {
                resolve();
            }
            audio.play().catch((e) => {
                reject(e);
            });
        })
    }

    public stopAll(): void {
        for(let audio of this._audios) {
            audio.pause();
        }
    }
}
