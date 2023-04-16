import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { MenuItem } from 'src/app/types/menu-item';

@Component({
  selector: 'app-master-dashboard-page',
  templateUrl: './master-dashboard-page.component.html',
  styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit {

  selectedItem: MenuItem = {
    title: 'Soundboard'
  };
  fools: any[] = [];
  target: any = null;

  constructor(private websocket: WebSocketService, public assetsService: AssetsService) { }

  ngOnInit(): void {
    // Update role if needed
    if (this.websocket.role !== 'master') {
      this.websocket.role = 'master';
      this.websocket.socket.emit('role', 'master');
    }

    this.websocket.socket.on('foolList', (list: any) => {
      console.log(list);
      this.fools = list;
      if (list.length <= 0) this.target = null;
    });

    this.assetsService.getServerImages().then((data: any[]) => {
      console.log(data);
    });
  }

  selectTarget(fool: any) {
    this.target = this.target === fool ? null : fool;
  }

  selectItem(item: MenuItem) {
    this.selectedItem = item;
  }
}
