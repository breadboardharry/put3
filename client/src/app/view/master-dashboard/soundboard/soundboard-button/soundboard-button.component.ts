import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from "../../../../services/websocket-service/websocket.service";
import { FileData } from 'src/app/types/resources/file-data';

@Component({
  selector: 'app-soundboard-button',
  templateUrl: './soundboard-button.component.html',
  styleUrls: ['./soundboard-button.component.scss']
})
export class SoundboardButtonComponent implements OnInit {

  @Input() track!: FileData;
  @Input() volume!: number;
  @Input() target!: any;
  @Input() disabled: boolean = false;
  constructor(private websocket: WebSocketService) { }

  ngOnInit(): void {
  }

  play(track: FileData) {
    this.websocket.socket.emit('action', {
      target: this.target,
      action: {
        type: 'audio',
        track: track.name,
        volume: this.volume / 100
      }
    });
  }

  normalize(str: string): string {
    const trim = 18;
    // Remove the first part of the path and the file extension
    str = str.split('/')[1].split('.')[0];
    const len = str.length;
    // Trim the string if it's too long
    if (len >= trim) str = str.substring(0, trim) + '...';
    return str;
  }
}
