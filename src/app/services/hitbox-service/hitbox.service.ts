import { Injectable } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';

@Injectable({
  providedIn: 'root'
})
export class HitboxService {

  private running: boolean = false;
  public hitboxes: Hitbox[] = [];

  constructor() { }

  public addNew() {
    // Add new hitbox only if not running
    if(this.running) return;
    this.hitboxes.push({
      size: {
        width: 250,
        height: 100
      },
      behavior: {
        trigger: undefined,
        action: undefined
      },
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
}
