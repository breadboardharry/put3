import { Component, OnInit } from '@angular/core';
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
        title: DashboardPage.Resources
    };
    fools: any[] = [];
    target: any = null;
    dashboardPage = DashboardPage;

  constructor(private websocket: WebSocketService, public resourceService: ResourcesService) { }

  ngOnInit(): void {
    // Update role if needed
    if (this.websocket.role !== 'master') {
      this.websocket.role = 'master';
      this.websocket.socket.emit('role', 'master');
    }

    this.websocket.socket.on('foolList', (list: any) => {
      this.fools = list;
      if (list.length <= 0) this.target = null;
    });
  }

  selectTarget(fool: any) {
    this.target = this.target === fool ? null : fool;
  }

  selectItem(item: MenuItem) {
    this.selectedItem = item;
  }
}
