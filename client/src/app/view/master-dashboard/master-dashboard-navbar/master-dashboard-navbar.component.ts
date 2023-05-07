import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'src/app/types/menu-item';
import { dashboardNavbarMenus } from 'src/app/data/dashboard-navbar-menus';

@Component({
    selector: 'app-master-dashboard-navbar',
    templateUrl: './master-dashboard-navbar.component.html',
    styleUrls: ['./master-dashboard-navbar.component.scss']
})
export class MasterDashboardNavbarComponent implements OnInit {

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
