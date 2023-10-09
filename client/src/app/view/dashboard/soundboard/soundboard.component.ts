import { Component, Input, OnInit } from '@angular/core';
import { Fool } from 'src/app/classes/fool';
import { ResourceType } from 'src/app/enums/resources/type';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { FileData } from 'src/app/types/resources/file-data';

@Component({
  selector: 'app-soundboard',
  templateUrl: './soundboard.component.html',
  styleUrls: ['./soundboard.component.scss']
})
export class SoundboardComponent implements OnInit {

  @Input() fools: Fool[] = [];
  @Input() target!: Fool | undefined;
  @Input() disabled: boolean = false;
  volume: number = 50;

    tracks: FileData[] = [];

    constructor(private websocket: WebSocketService, public resourceService: ResourcesService) { }

    ngOnInit(): void {
        this.resourceService.getDataByType(ResourceType.Audio).then((data) => {
            this.tracks = data;
        })
    }

    stopAll() {
        this.websocket.socket.emit('action', {
            target: this.target,
            action: {
                type: 'audio',
                stop: true
            }
        });
    }
}
