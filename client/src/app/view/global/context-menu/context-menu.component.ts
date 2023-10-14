import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextMenuItem } from 'src/app/types/context-menu-item';

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit {

    @Input()
    items: ContextMenuItem[] = [];

    @Output()
    itemClick: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    public onClick(event: any, item: ContextMenuItem) {
        this.itemClick.emit({event, item});
    }
}
