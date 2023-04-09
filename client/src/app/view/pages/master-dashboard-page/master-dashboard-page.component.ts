import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';

@Component({
  selector: 'app-master-dashboard-page',
  templateUrl: './master-dashboard-page.component.html',
  styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit {

  fools: any[] = [];
  target: any = null;

  constructor(private websocket: WebSocketService) { }

  ngOnInit(): void {
    // Update role if needed
    if (this.websocket.role !== 'master') {
      this.websocket.role = 'master';
      this.websocket.socket.emit('role', 'master');
    }

    this.websocket.socket.on('foolList', (foolList: any) => {
      this.fools = foolList;
    });
  }

  selectTarget(fool: any) {
    this.target = fool;
  }

  action() {
    this.websocket.socket.emit('action', { target: this.target });
  }
}
