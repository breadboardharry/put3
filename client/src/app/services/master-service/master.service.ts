import { Injectable } from '@angular/core';
import { EventService } from '../event-service/event.service';
import { Fool } from 'src/app/classes/fool';
import { EnumActionType } from 'put3-models';

@Injectable({
    providedIn: 'root'
})
export class MasterService {

    constructor(
        private eventService: EventService,
    ) { }

    /**
     * Send a shutdown action to a fool
     * - Redirect fool to google.com
     */
    public shutdownFool(fool: Fool): void {
        this.eventService.sendAction(fool, {
            type: EnumActionType.SHUTDOWN
        })
    }

    public sendConfig(fool: Fool) {
        this.eventService.sendLayout(fool, fool.layout);
    }
}
