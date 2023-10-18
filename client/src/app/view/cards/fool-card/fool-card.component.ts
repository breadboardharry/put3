import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fool } from 'src/app/classes/fool';
import { BrowserService } from 'src/app/services/utils/browser-service/browser.service';

@Component({
    selector: 'app-fool-card',
    templateUrl: './fool-card.component.html',
    styleUrls: ['./fool-card.component.scss']
})
export class FoolCardComponent implements OnInit {

    @Input() fool!: Fool;
    @Input() rename?: boolean = false;
    @Input() selected?: boolean = false;
    @Output() editedEvent: EventEmitter<string> = new EventEmitter<string>();

    public name = '';

    constructor(public browser: BrowserService) {}

    ngOnInit(): void {
        this.name = this.fool.name;
    }

    public editDone() {
        this.editedEvent.emit(this.name);
    }

    public get foolBrowser() {
        return this.fool.browser || undefined;
    }

}
