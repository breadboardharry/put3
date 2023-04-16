import { Component, HostListener, OnInit } from '@angular/core';
import { CursorService } from 'src/app/services/cursor-service/cursor.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';

@Component({
  selector: 'app-fool-home-page',
  templateUrl: './fool-home-page.component.html',
  styleUrls: ['./fool-home-page.component.scss']
})
export class FoolHomePageComponent implements OnInit {

  desktopBackground: string = 'assets/images/default-desktop-background.jpg';

  constructor(
    public hitboxService: HitboxService,
    public cursorService: CursorService,
    private websocket: WebSocketService,
    private audio: AudioService,
    private desktopService: DesktopService
  ) { }

  ngOnInit(): void {
    // Update role if needed
    if (this.websocket.role !== 'fool') {
      this.websocket.role = 'fool';
      this.websocket.socket.emit('role', 'fool');
    }

    this.websocket.socket.on('action', (data: any) => {
      this.action(data);
    });

    // Get desktop background image
    this.desktopService.getBackground().then(image => {
      this.desktopBackground = image;
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Add new hitbox
    if (event.ctrlKey && (event.code === '+' || event.code === 'Backquote')) {
      this.hitboxService.addNew();
      console.log('New hitbox added');
    }

    // Run
    if (event.ctrlKey && event.code === 'Space') {
      this.hitboxService.run();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

  action(data: any) {
    // Check if this user is the target
    if (data.target.id !== this.websocket.id) return;

    switch (data.action.type) {
      case 'audio':
        const volume = 'volume' in data.action ? data.action.volume : 1.0;
        if ('stop' in data.action && data.action.stop) this.audio.stopAll();
        else if ('track' in data.action) this.audio.play('assets/sounds/' + data.action.track, volume);
        break;

      default:
        console.log(data);
        break;
    }
  }
}
