import { Component, Input, OnInit } from '@angular/core';
import { EnumActionType, EnumResourceType, FileData } from 'put3-models';
import { Session } from 'src/app/classes/session';
import { EventService } from 'src/app/services/event-service/event.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';

@Component({
  selector: 'app-soundboard',
  templateUrl: './soundboard.component.html',
  styleUrls: ['./soundboard.component.scss']
})
export class SoundboardComponent implements OnInit {

  @Input() sessions: Session[] = [];
  @Input() target?: Session;
  @Input() disabled: boolean = false;
  volume: number = 50;

    tracks: FileData[] = [];

    constructor(
        private eventService: EventService,
        public resourceService: ResourcesService
    ) { }

    ngOnInit(): void {
        this.resourceService.getDataByType(EnumResourceType.AUDIO).then((data) => {
            this.tracks = data;
        })
    }

    public stopAll() {
        if (!this.target) return;
        this.eventService.sendAction(this.target.fool, {
            type: EnumActionType.AUDIO,
            data: {
                stop: true
            }
        });
    }
}
