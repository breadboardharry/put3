import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { EnumNavbarItemTitle } from 'src/app/enums/dashboard-pages';
import { Router } from '@angular/router';
import { EnumAppRoute } from 'src/app/enums/routes';
import { ClientService } from 'src/app/services/client-service/client.service';

@Component({
    selector: 'app-dashboard-navbar',
    templateUrl: './dashboard-navbar.component.html',
    styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent implements OnInit {

    public EnumNavbarItemTitle = EnumNavbarItemTitle;
    public EnumAppRoute = EnumAppRoute;
    public ClientService = ClientService;

    constructor(
        private adminService: AdminService,
        private router: Router
    ) {}

    ngOnInit(): void {
    }

    public navigate(path: string) {
        this.router.navigate([EnumAppRoute.MASTER, path.toLowerCase()]);
    }

    public logout() {
        this.adminService.logout();
    }
}
