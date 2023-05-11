import { Component, HostListener, OnInit } from '@angular/core';
import { CursorService } from 'src/app/services/cursor-service/cursor.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { environment } from 'src/environments/environment';
import { WindowService } from 'src/app/services/window-service/window.service';
import { PreferencesService } from 'src/app/services/preferences-service/preferences.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { Layout } from 'src/app/types/layout';
import { LayoutService } from 'src/app/services/layout-service/layout.service';

@Component({
  selector: 'app-fool-home-page',
  templateUrl: './fool-home-page.component.html',
  styleUrls: ['./fool-home-page.component.scss']
})
export class FoolHomePageComponent implements OnInit {

    apiUrl = environment.serverUrl + environment.apiPath;
    layout: Layout = {
        hitboxes: [],
        desktop: {
            image: undefined
        }
    };
    defaultDesktopImage = environment.defaultDesktopImage;

    constructor(private layoutService: LayoutService, private resourceService: ResourcesService, private preferences: PreferencesService, private windowService: WindowService, public cursorService: CursorService, private websocket: WebSocketService, private audio: AudioService, private desktopService: DesktopService ) {}

    ngOnInit(): void {
        // Update role if needed
        if (this.websocket.role !== 'fool') {
            this.websocket.role = 'fool';
            this.websocket.socket.emit('role', 'fool');
        }

        // Send window size to server
        this.websocket.socket.emit('window', this.windowService.getWindowSize());

        this.websocket.socket.on('action', (data: any) => {
            this.action(data);
        });

        this.websocket.socket.on('layout', (data: any) => {
            if (data.target.id !== this.websocket.id) return;
            this.layout = this.layoutService.newFoolLayout(data.layout);
        });

        this.setDesktopImage();
    }

    async setDesktopImage() {
        // Check in cookies if there a previous desktop image is set
        const prevDesktop: any = this.preferences.getDesktop();

        if (prevDesktop) {
            // Check if the image still exists
            const imageExists = await this.resourceService.exists(prevDesktop.image);
            if (imageExists) this.layout.desktop.image = prevDesktop.image;
        }
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
                console.log({data});
                break;
        }
    }
}
