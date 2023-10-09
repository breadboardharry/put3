import { Component, Input, OnInit } from '@angular/core';
import { Fool } from 'src/app/classes/fool';
import { ResourceType } from 'src/app/enums/resources/type';
import { EventService } from 'src/app/services/event-service/event.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
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

    constructor(
        private eventService: EventService,
        public resourceService: ResourcesService
    ) { }

    ngOnInit(): void {
        this.resourceService.getDataByType(ResourceType.Audio).then((data) => {
            this.tracks = data;
        })
    }

    stopAll() {
        if (!this.target) return;
        this.eventService.sendAction(this.target, {
            type: 'audio',
            stop: true
        });
    }
}
