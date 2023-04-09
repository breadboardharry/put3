import { Component } from '@angular/core';
import { InteractionTemplateComponent } from '../template/interaction-template.component';
import { AudioService } from 'src/app/services/sound-service/audio.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent extends InteractionTemplateComponent {

  constructor(private audioService: AudioService) {
    super();
  }

  init() {
    // Play sound when component is created
    this.audioService.play('assets/sounds/' + this.data.track);
  }

  onHover(hover: boolean): void { }
  onClick(): void { }
  onSingleClick(): void { }
  onDoubleClick(): void { }
  onOutsideClick(): void { }
}
