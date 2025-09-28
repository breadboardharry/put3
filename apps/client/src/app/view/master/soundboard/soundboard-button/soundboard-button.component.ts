import { Component, Input, OnInit } from '@angular/core';
import { EnumActionType } from 'src/app/app-models/enums/action';
import { Session } from 'src/app/classes/session';
import { Media, RemoteMedia } from 'src/app/providers/media';
import { EventService } from 'src/app/services/event-service/event.service';
import { MediaService } from 'src/app/services/resources-service/resources.service';
import path from 'src/app/utilities/path';

@Component({
    selector: 'app-soundboard-button',
    templateUrl: './soundboard-button.component.html',
    styleUrls: ['./soundboard-button.component.scss'],
})
export class SoundboardButtonComponent implements OnInit {
    @Input() track!: RemoteMedia;
    @Input() volume!: number;
    @Input() target!: Session;
    @Input() disabled: boolean = false;

    constructor(
        private eventService: EventService,
        public resourceService: MediaService
    ) {}

    ngOnInit(): void {}

    play(track: Media) {
        this.eventService.sendAction(this.target.fool, {
            type: EnumActionType.AUDIO,
            data: {
                track,
                volume: this.volume / 100,
            },
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

    public formatName(name: string): string {
        return path.basename(name, '.' + path.extname(name));
    }
}
