import { Component, OnInit } from '@angular/core';
import { Fool } from 'src/app/classes/fool';
import { DashboardPage } from 'src/app/enums/dashboard-pages';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { MenuItem } from 'src/app/types/menu-item';

@Component({
    selector: 'app-master-dashboard-page',
    templateUrl: './master-dashboard-page.component.html',
    styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit {

    selectedItem: MenuItem = {
        title: DashboardPage.Layout
    };
    fools: Fool[] = [];
    target: Fool | undefined = undefined;
    dashboardPage = DashboardPage;

    constructor(private websocket: WebSocketService, public resourceService: ResourcesService) { }

    ngOnInit(): void {
        // Update role if needed
        if (this.websocket.role !== 'master') {
            this.websocket.role = 'master';
            this.websocket.socket.emit('role', 'master');
        }

        this.websocket.socket.on('foolList', (list: any) => {
            this.fools = list.map((fool: any) => new Fool(fool));
            this.updateTarget();
        });
    }

    updateTarget() {
        // If a target is defined, check if it still exists
        if (this.target && this.fools.length) {
            this.target = this.fools.find((fool) => fool.id === this.target!.id);
        }
        else this.target = undefined;
    }

    selectTarget(fool: Fool) {
        this.target = this.target === fool ? undefined : fool;
    }

    selectItem(item: MenuItem) {
        this.selectedItem = item;
    }
}
