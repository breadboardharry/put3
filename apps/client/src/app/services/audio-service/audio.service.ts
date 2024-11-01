import { Injectable } from '@angular/core';
import { SoundLoop } from 'src/app/interfaces/sound-loop';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private audios: HTMLAudioElement[] = [];
    public canPlay: boolean = false;

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
        this.audios.push(audio);

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

    /**
     * Stop all the audios played by the audio service
     */
    public stopAll(): void {
        for(const audio of this.audios) {
            audio.pause();
        }
    }

    /**
     * Wait for the audio service to be ready to play sounds
     * - Audio can't be played before the user interact with the page
     */
    public waitForInit(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.canPlay) return resolve();
            const interval = setInterval(() => {
                this.play('assets/audios/blank.mp3').then(() => {
                    clearInterval(interval);
                    this.canPlay = true;
                    resolve();
                }).catch(() => {});
            }, 500);
        });
    }
}
