import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MicrophoneService {

    private mediaStream!: MediaStream;
    public hasPermission: boolean = false;

    constructor() { }

    public async askPermission(): Promise<boolean> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            this.hasPermission = true;
        } catch (error) {
            this.hasPermission = false;
        } finally {
            return this.hasPermission;
        }
    }

    public async getMicrophoneStream(): Promise<MediaStream> {
        if (!this.mediaStream) {
            try {
                this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (error) {
                console.error('Error while getting audio stream :', error);
                throw error;
            }
        }
        return this.mediaStream;
    }

}
