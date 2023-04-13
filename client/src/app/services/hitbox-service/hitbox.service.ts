import { Injectable } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { WebSocketService } from '../websocket-service/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class HitboxService {

  private running: boolean = false;
  public hitboxes: Hitbox[] = [];

  constructor(private websocket: WebSocketService) { }

  public addNew() {
    // Add new hitbox only if not running
    if(this.running) return;
    this.hitboxes.push({
      size: {
        width: 88,
        height: 88
      },
      events: [],
      active: this.running
    });
  }

  public run() {
    this.running = true;
    this.websocket.socket.emit('status', 'running');
    console.log(this.hitboxes);
    this.hitboxes.forEach(hitbox => {
      hitbox.active = true;
    });
    console.log('Running...');
  }
}
