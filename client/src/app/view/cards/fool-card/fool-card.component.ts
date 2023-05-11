import { Component, Input, OnInit } from '@angular/core';
import { BrowserService } from 'src/app/services/utils/browser-service/browser.service';

@Component({
    selector: 'app-fool-card',
    templateUrl: './fool-card.component.html',
    styleUrls: ['./fool-card.component.scss']
})
export class FoolCardComponent implements OnInit {

    @Input() fool!: any;
    @Input() selected?: boolean = false;

    constructor(public browser: BrowserService) {}

    ngOnInit(): void {}

}
