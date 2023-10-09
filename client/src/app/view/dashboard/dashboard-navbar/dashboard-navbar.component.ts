import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'src/app/types/menu-item';
import { dashboardNavbarMenus } from 'src/app/data/dashboard-navbar-menus';

@Component({
    selector: 'app-dashboard-navbar',
    templateUrl: './dashboard-navbar.component.html',
    styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent implements OnInit {

    @Input() selectedItem!: MenuItem;
    @Output() selectedItemEvent: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

    menus = dashboardNavbarMenus;

    constructor() {}

    ngOnInit(): void {}

    selectItem(item: MenuItem) {
        this.selectedItem = item;
        this.selectedItemEvent.emit(item);
    }
}
