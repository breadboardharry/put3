import { Component } from '@angular/core';
import { InteractionTemplateComponent } from '../template/interaction-template.component';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent extends InteractionTemplateComponent {

  constructor(private audioService: AudioService, private backend: BackendService) {
    super();
  }

  init() {
    // Play sound when component is created
    this.audioService.play(this.backend.serverUrl + '/' + this.data.track.href);
  }

  onHover(hover: boolean): void { }
  onClick(): void { }
  onSingleClick(): void { }
  onDoubleClick(): void { }
  onOutsideClick(): void { }
}
