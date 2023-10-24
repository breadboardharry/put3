import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { environment } from 'src/environments/environment';
import { Hitbox } from 'src/app/classes/hitbox';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Session } from 'src/app/classes/session';
import { EnumResourceType } from 'put3-models';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';
import { MasterService } from 'src/app/services/master-service/master.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';

@Component({
    selector: 'app-layout-editor',
    templateUrl: './layout-editor.component.html',
    styleUrls: ['./layout-editor.component.scss'],
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
        public backend: BackendService,
        private masterService: MasterService,
        private desktopService: DesktopService,
        public hitboxService: HitboxService,
        private resourcesService: ResourcesService,
    ) {}

    ngOnInit(): void {
        // Get desktop background image
        this.desktopService.getBackground().then((image) => {
            this.defaultDesktopImage = image;
        });
    }

    ngAfterViewInit(): void {
        this.hitboxService.setWindow(() => {
            return this.editor
        });
    }

    public addHitbox() {
        this.target!.fool.layout.hitboxes.push(new Hitbox());
    }

    public changeBackground() {
        this.resourcesService.browse(EnumResourceType.IMAGE).then((image: any) => {
            if (!image) return;
            this.target!.fool.layout.desktop.image = image.href;
        });
    }

    public sendConfig() {
        this.masterService.sendConfig(this.target!.fool);
    }
}
