import { Component, Input, OnInit } from '@angular/core';
import { FileData } from 'src/app/types/resources/file-data';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { FileService } from 'src/app/services/utils/file-service/file.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { EnumActionType } from 'src/app/enums/type-action';
import { Session } from 'src/app/classes/session';

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
            track,
            volume: this.volume / 100
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
