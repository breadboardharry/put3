import { Component } from '@angular/core';
import { APIService } from 'src/app/services/api/api.service';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { InteractionTemplateComponent } from '../template/interaction-template.component';

@Component({
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
})
export class AudioPlayerComponent extends InteractionTemplateComponent {
    constructor(private audioService: AudioService, private api: APIService) {
        super();
    }

    init() {
        // Play sound when component is created
        this.audioService.play(this.api.serverUrl + '/' + this.data.track.src);
    }

    onHover(hover: boolean): void {}
    onClick(): void {}
    onSingleClick(): void {}
    onDoubleClick(): void {}
    onOutsideClick(): void {}
}
