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
    this.hitboxes.forEach(hitbox => {
        hitbox.active = true;
    });
    console.log('Running...');
  }

    public getWindowHeight() {
        return window.innerHeight;
    }

    public getWindowWidth() {
        return window.innerWidth;
    }

    public getWindowRatio() {
        return this.getWindowWidth() / this.getWindowHeight();
    }

    public getWindowSize() {
        return {
            width: this.getWindowWidth(),
            height: this.getWindowHeight(),
            ratio: this.getWindowRatio()
        }
    }
}
