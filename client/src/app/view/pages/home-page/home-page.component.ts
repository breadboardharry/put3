import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router, private websocket: WebSocketService) { }

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
}
