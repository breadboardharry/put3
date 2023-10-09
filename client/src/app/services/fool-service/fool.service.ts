import { Injectable } from '@angular/core';
import { Fool } from 'src/app/classes/fool';
import { EventService } from '../event-service/event.service';

@Injectable({
    providedIn: 'root',
})
export class FoolService {

    constructor(private eventService: EventService) {}

    public sendConfig(fool: Fool) {
        this.eventService.sendLayout(fool, fool.layout);
    }
    
}
