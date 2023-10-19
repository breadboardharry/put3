import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-button-small',
    templateUrl: './button-small.component.html',
    styleUrls: ['./button-small.component.scss']
})
export class ButtonSmallComponent implements OnInit {

    @Input() disabled: boolean = false;

    constructor() {}

    ngOnInit(): void {}

}
