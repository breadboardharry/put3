import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'src/app/types/menu-item';
import { dashboardNavbarMenus } from 'src/app/data/dashboard-navbar-menus';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard-navbar',
    templateUrl: './dashboard-navbar.component.html',
    styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent implements OnInit {

    @Input() selectedItem!: MenuItem;
    @Output() selectedItemEvent: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

    public menus = dashboardNavbarMenus;

    constructor(
        private adminService: AdminService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    selectItem(item: MenuItem) {
        if (item.title.toLowerCase() === 'logout') {
            this.logout();
            return;
        }
        this.selectedItem = item;
        this.selectedItemEvent.emit(item);
    }

    private logout() {
        this.adminService.logout();
    }
}
