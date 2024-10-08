import { Component, Input, OnInit } from '@angular/core';
import { EnumActionType } from 'src/app/app-models/enums/action';
import { EnumResourceType } from 'src/app/app-models/enums/resources';
import { FileData } from 'src/app/app-models/types/file';
import { Session } from 'src/app/classes/session';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';
import { ClientService } from 'src/app/services/client-service/client.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';

@Component({
  selector: 'app-soundboard',
  templateUrl: './soundboard.component.html',
  styleUrls: ['./soundboard.component.scss']
})
export class SoundboardComponent implements OnInit, DashboardSection {

    @Input() sessions: Session[] = [];

    @Input() target?: Session;

    @Input() disabled: boolean = false;

    volume: number = 50;

    tracks: FileData[] = [];

    constructor(
        private eventService: EventService,
        public resourceService: ResourcesService,
    ) { }

    ngOnInit(): void {
        this.resourceService.getDataByType(EnumResourceType.AUDIO).then((data) => {
            this.tracks = data;
        });
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

    public get displayAlert(): boolean {
        return !!this.target && (!this.hasTargetBrowserPermission ||
            (!ClientService.IS_ADMIN && !this.hasTargetSoundTurnedOn)
        );
    }

    private get hasTargetSoundTurnedOn(): boolean {
        return !!this.target && !!this.target.fool.settings.audio;
    }

    private get hasTargetBrowserPermission(): boolean {
        return !!this.target && !!this.target.fool.browser.permissions.audio;
    }
}
