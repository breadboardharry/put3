import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceType } from 'src/app/enums/resources/type';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { ResourceBrowserModal } from '../../dialogs/resource-browser/resource-browser.modal';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-layout-editor',
    templateUrl: './layout-editor.component.html',
    styleUrls: ['./layout-editor.component.scss'],
})
export class LayoutEditorComponent implements OnInit {

    @ViewChild('content') content!: ElementRef;
    @ViewChild('editor') editor!: ElementRef;
    @Input() fools: any[] = [];
    @Input() target!: any;
    @Input() disabled: boolean = false;

    apiUrl = environment.serverUrl + environment.apiPath;
    defaultWallpaper = environment.defaultWallpaper;

    constructor(private dialog: MatDialog, private websocket: WebSocketService, private desktopService: DesktopService, public hitboxService: HitboxService) {}

    ngOnInit(): void {
        // Get desktop background image
        this.desktopService.getBackground().then((image) => {
            this.defaultWallpaper = image;
        });
    }

    ngAfterViewInit(): void {
        this.hitboxService.setWindow(() => {
            return this.editor
        });
    }

    isWindowDefined(): boolean {
        return this.target && this.target.data && this.target.data.window;
    }

    isWallpaperDefined(): boolean {
        return this.isWindowDefined() && this.target.data.window.wallpaper;
    }

    addHitbox() {
        this.hitboxService.addNew(this.target.id);
    }

    sendConfig() {
        this.hitboxService.send(this.target);
        this.websocket.socket.emit('action', {
            target: this.target,
            action: {
                type: 'wallpaper',
                image: this.target.data.window.wallpaper
            }
        });
    }

    changeBackground() {
        const dialogRef = this.dialog.open(ResourceBrowserModal, {
            data: { type: ResourceType.Image }
        });

        dialogRef.afterClosed().subscribe(image => {
            if (!image) return;

            this.target.data.window.wallpaper = image;
            console.log(this.target);
        });
    }
}
