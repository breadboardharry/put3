import { Component, Input, OnInit } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { FileService } from 'src/app/services/utils/file-service/file.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { Session } from 'src/app/classes/session';
import { FileData } from 'src/app/app-models/types/file';
import { EnumActionType } from 'src/app/app-models/enums/action';

@Component({
  selector: 'app-soundboard-button',
  templateUrl: './soundboard-button.component.html',
  styleUrls: ['./soundboard-button.component.scss']
})
export class SoundboardButtonComponent implements OnInit {

    @Input() track!: FileData;
    @Input() volume!: number;
    @Input() target!: Session;
    @Input() disabled: boolean = false;

    constructor(
        public fileService: FileService,
        private eventService: EventService,
        public resourceService: ResourcesService
    ) { }

    ngOnInit(): void {
    }

    play(track: FileData) {
        this.eventService.sendAction(this.target.fool, {
            type: EnumActionType.AUDIO,
            data: {
                track,
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
