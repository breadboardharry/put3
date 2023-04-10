import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';

@Component({
  selector: 'app-master-dashboard-page',
  templateUrl: './master-dashboard-page.component.html',
  styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit {

  fools: any[] = [];
  target: any = null;
  volume: number = 100;

  constructor(private websocket: WebSocketService, public assetsService: AssetsService) { }

  ngOnInit(): void {
    // Update role if needed
    if (this.websocket.role !== 'master') {
      this.websocket.role = 'master';
      this.websocket.socket.emit('role', 'master');
    }

    this.websocket.socket.on('foolList', (foolList: any) => {
      this.fools = foolList;
      if (foolList.length <= 0) this.target = null;
    });
  }

  selectTarget(fool: any) {
    this.target = this.target === fool ? null : fool;
  }

  soundboard(track: string) {
    this.websocket.socket.emit('action', {
      target: this.target,
      action: {
        type: 'audio',
        track: track,
        volume: this.volume / 100
      }
    });
  }

  normalize(str: string): string {
    const trim = 18;
    // Remove the first part of the path and the file extension
    str = str.split('/')[1].split('.')[0];
    const len = str.length;
    // Trim the string if it's too long
    if (len >= trim) str = str.substring(0, trim) + '...';
    return str;
  }

  stopAll() {
    this.websocket.socket.emit('action', {
      target: this.target,
      action: {
        type: 'audio',
        stop: true
      }
    });
  }
}
