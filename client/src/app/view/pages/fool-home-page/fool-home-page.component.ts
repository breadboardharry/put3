import { Component, HostListener, OnInit } from '@angular/core';
import { CursorService } from 'src/app/services/cursor-service/cursor.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { environment } from 'src/environments/environment';
import { WindowService } from 'src/app/services/window-service/window.service';

@Component({
  selector: 'app-fool-home-page',
  templateUrl: './fool-home-page.component.html',
  styleUrls: ['./fool-home-page.component.scss']
})
export class FoolHomePageComponent implements OnInit {

    private apiUrl = environment.serverUrl + environment.apiPath
    desktopBackground: string = 'assets/images/default-desktop-background.jpg';

  constructor(private windowService: WindowService, public hitboxService: HitboxService, public cursorService: CursorService, private websocket: WebSocketService, private audio: AudioService, private desktopService: DesktopService ) {}

  ngOnInit(): void {
    // Update role if needed
    if (this.websocket.role !== 'fool') {
      this.websocket.role = 'fool';
      this.websocket.socket.emit('role', 'fool');
      this.websocket.socket.emit('window', this.windowService.getWindowSize());
    }

    this.websocket.socket.on('action', (data: any) => {
        this.action(data);
    });

    this.websocket.socket.on('hitboxes', (data: any) => {
        if (data.target.id !== this.websocket.id) return;
        console.log('hitboxes', data);
        this.hitboxService.import(data.hitboxes, true);
    });

    // Get desktop background image
    this.desktopService.getBackground().then(image => {
      this.desktopBackground = image;
    });
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

    timeout: NodeJS.Timeout | undefined;
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        // Send window size to server
        if (this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.websocket.socket.emit('window', this.windowService.getWindowSize());
        }, 500);

    }

  action(data: any) {
    // Check if this user is the target
    if (data.target.id !== this.websocket.id) return;

    switch (data.action.type) {
      case 'audio':
        const volume = 'volume' in data.action ? data.action.volume : 1.0;
        if ('stop' in data.action && data.action.stop) this.audio.stopAll();
        else if ('track' in data.action) this.audio.play(this.apiUrl + '/' + data.action.track.href, volume);
        break;

      default:
        console.log(data);
        break;
    }
  }
}
