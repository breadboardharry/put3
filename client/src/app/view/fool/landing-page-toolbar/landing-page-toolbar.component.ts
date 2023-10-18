import { Component, OnInit } from '@angular/core';
import { EnumFoolScript } from 'put3-models';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { FoolService } from 'src/app/services/fool-service/fool.service';
import { MicrophoneService } from 'src/app/services/microphone/microphone.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { WindowService } from 'src/app/services/window-service/window.service';

@Component({
    selector: 'app-fool-landing-page-toolbar',
    templateUrl: './landing-page-toolbar.component.html',
    styleUrls: ['./landing-page-toolbar.component.scss']
})
export class LandingPageToolbarComponent implements OnInit {

    public EnumScript = EnumFoolScript;

    constructor(
        public audio: AudioService,
        public foolService: FoolService,
        public windowService: WindowService,
        private microphone: MicrophoneService,
        private camera: CameraService,
        private snackbar: SnackbarService,
        public assetsService: AssetsService,
    ) { }

    ngOnInit(): void {
        this.audio.waitForInit().then(() => {
            this.foolService.audioEnabled = true;
            this.foolService.sendInfos();
        });
    }

    public run() {
        this.foolService.run();
    }

    public toggleNotifications() {

    }

    public toggleAudio() {
        if (!this.audio.canPlay) return;
        this.foolService.audioEnabled = !this.foolService.audioEnabled;
        this.foolService.sendInfos();
    }

    public async toggleMicrophone() {
        const granted = await this.microphone.askPermission();
        if (!granted) {
            this.snackbar.openError('Microphone permission denied');
            this.foolService.microphoneEnabled = false;
            return;
        }
        else this.foolService.microphoneEnabled = !this.foolService.microphoneEnabled;
        this.foolService.sendInfos();
    }

    public async toggleCamera() {
        const granted = await this.camera.askPermission();
        if (!granted) {
            this.snackbar.openError('Camera permission denied');
            this.foolService.cameraEnabled = false;
            return;
        }
        else this.foolService.cameraEnabled = !this.foolService.cameraEnabled;
        this.foolService.sendInfos();
    }

}
