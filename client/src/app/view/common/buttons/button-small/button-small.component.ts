import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-button-small',
    templateUrl: './button-small.component.html',
    styleUrls: ['./button-small.component.scss']
})
export class ButtonSmallComponent implements OnInit {

    @Input() icon?: string;
    @Input() invertIcon?: boolean;
    @Input() iconPosition: 'left' | 'right' = 'left';
    @Input() hideIconOnMobile: boolean = false;
    @Input() disabled: boolean = false;

    constructor() {}

    ngOnInit(): void {}

}
