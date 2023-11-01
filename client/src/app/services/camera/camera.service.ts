import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CameraService {

    private mediaStream!: MediaStream;
    public hasPermission: boolean = false;

    constructor() { }

    public async askPermission(): Promise<boolean> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            this.hasPermission = true;
        } catch (error) {
            this.hasPermission = false;
        } finally {
            return this.hasPermission;
        }
    }

    public async getCameraStream(): Promise<MediaStream> {
        if (!this.mediaStream) {
            try {
                this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (error) {
                // ENglish
                console.error('Error while getting video stream :', error);
                throw error;
            }
        }
        return this.mediaStream;
    }


}
