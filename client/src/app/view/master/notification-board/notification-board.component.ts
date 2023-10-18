import { Component, Input, OnInit } from '@angular/core';
import { Session } from 'src/app/classes/session';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';

@Component({
    selector: 'app-notification-board',
    templateUrl: './notification-board.component.html',
    styleUrls: ['./notification-board.component.scss']
})
export class NotificationBoardComponent implements OnInit, DashboardSection {

    @Input() sessions: Session[] = [];
    @Input() target?: Session;
    @Input() disabled: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

}
