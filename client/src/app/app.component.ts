import { Component, HostListener } from '@angular/core';
import { HitboxService } from './services/hitbox-service/hitbox.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'put3';

  constructor(private hitbox: HitboxService) { }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // CTRL +
    if (event.ctrlKey && (event.code === '+' || event.code === 'Backquote')) {
      this.hitbox.addNew();
    }
  }
}
