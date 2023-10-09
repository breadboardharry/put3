import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-button-raised',
    templateUrl: './button-raised.component.html',
    styleUrls: ['./button-raised.component.scss'],
})
export class ButtonRaisedComponent implements OnInit {

    @Input() disabled: boolean = false;

    constructor() {}

    ngOnInit(): void {}
}
