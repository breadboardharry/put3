import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { environment } from 'src/environments/environment';
import { Hitbox } from 'src/app/classes/hitbox';
import { APIService } from 'src/app/services/api/api.service';
import { Session } from 'src/app/classes/session';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';
import { MasterService } from 'src/app/services/master-service/master.service';
import { MediaService } from 'src/app/services/resources-service/resources.service';
import { EnumResourceType } from 'src/app/app-models/enums/resources';

@Component({
    selector: 'app-layout-editor',
    templateUrl: './layout-editor.component.html',
    styleUrls: ['./layout-editor.component.scss'],
    host: {
        class: 'p-8 pt-0',
    },
})
export class LayoutEditorComponent implements OnInit, DashboardSection {
    @ViewChild('editor')
    public editor!: ElementRef;

    @Input()
    public sessions: Session[] = [];

    @Input()
    public target?: Session;

    @Input()
    public disabled: boolean = false;

    public defaultDesktopImage = environment.defaultDesktopImage;

    constructor(
        public api: APIService,
        private masterService: MasterService,
        private desktopService: DesktopService,
        public hitboxService: HitboxService,
        private mediaService: MediaService
    ) {}

    ngOnInit(): void {
        // Get desktop background image
        this.desktopService.getBackground().then((image) => {
            this.defaultDesktopImage = image;
        });
    }

    ngAfterViewInit(): void {
        this.hitboxService.setWindow(() => {
            return this.editor;
        });
    }

    public addHitbox() {
        this.target!.fool.layout.hitboxes.push(new Hitbox());
    }

    public changeBackground() {
        this.mediaService
            .browse(EnumResourceType.IMAGE, true)
            .then((selection) => {
                if (!selection?.length) return;
                const image = selection[0];
                this.target!.fool.layout.desktop.image = image.src;
            });
    }

    public sendConfig() {
        this.masterService.sendConfig(this.target!.fool);
    }
}
