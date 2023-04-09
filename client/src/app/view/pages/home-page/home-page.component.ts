import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket-service/websocket.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router, private websocket: WebsocketService) { }

  ngOnInit(): void {
  }

  chooseMaster() {
    console.log('Master chosen');
    this.router.navigate(['/master']);
  }

  chooseFool() {
    console.log('Fool chosen');
    this.router.navigate(['/fool']);
  }
}
