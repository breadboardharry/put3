import { Component } from '@angular/core';
import { InteractionTemplateComponent } from '../template/interaction-template.component';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent extends InteractionTemplateComponent {

    private apiUrl = environment.serverUrl + environment.apiPath;

  constructor(private audioService: AudioService) {
    super();
  }

  init() {
    // Play sound when component is created
    this.audioService.play(this.apiUrl + '/' + this.data.track.href);
  }

  onHover(hover: boolean): void { }
  onClick(): void { }
  onSingleClick(): void { }
  onDoubleClick(): void { }
  onOutsideClick(): void { }
}
