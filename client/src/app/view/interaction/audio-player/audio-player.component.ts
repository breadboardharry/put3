import { Component, Input } from '@angular/core';
import { InteractionTemplateComponent } from '../template/interaction-template.component';
import { AudioService } from 'src/app/services/sound-service/audio.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent extends InteractionTemplateComponent {

  @Input() data: any;

  constructor(private audioService: AudioService) {
    super();

    this.audioService.play('assets/sounds/farts/pet_cri.mp3');
  }

  onHover(hover: boolean): void { }
  onClick(): void { }
  onSingleClick(): void { }
  onDoubleClick(): void { }
  onOutsideClick(): void { }
}
