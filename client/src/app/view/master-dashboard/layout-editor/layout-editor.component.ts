import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ResourceType } from 'src/app/enums/resources/type';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';

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

    desktopBackground: string = 'assets/images/default-desktop-background.jpg';

    constructor(private resourceService: ResourcesService, private websocket: WebSocketService, private desktopService: DesktopService, public hitboxService: HitboxService) {}

    ngOnInit(): void {
        // Get desktop background image
        this.desktopService.getBackground().then((image) => {
            this.desktopBackground = image;
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

    addHitbox() {
        this.hitboxService.addNew(this.target.id);
    }

    sendConfig() {
        this.hitboxService.send(this.target);
    }

    async changeBackground() {
        this.websocket.socket.emit('action', {
            target: this.target,
            action: {
                type: 'wallpaper',
                image: (await this.resourceService.getDataByType(ResourceType.Image))[0],
            }
        });
    }
}
