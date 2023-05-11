import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Script } from 'src/app/enums/assets/scrips';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  hover: 'master' | 'fool' | null = null;
  scripts = Script;

  constructor(public assetsService: AssetsService, private router: Router, private websocket: WebSocketService) { }

  ngOnInit(): void {
  }

  chooseMaster() {
    this.websocket.role = 'master';
    this.websocket.socket.emit('role', 'master');
    this.router.navigate(['/master']);
  }

  chooseFool() {
    this.websocket.role = 'fool';
    this.websocket.socket.emit('role', 'fool');
    this.router.navigate(['/fool']);
  }

  mouseEnter(elem: 'master' | 'fool') {
    this.hover = elem;
  }

  mouseLeave() {
    this.hover = null;
  }
}
