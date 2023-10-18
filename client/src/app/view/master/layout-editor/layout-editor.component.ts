import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { ResourceBrowserModal } from '../../dialogs/resource-browser/resource-browser.modal';
import { environment } from 'src/environments/environment';
import { Hitbox } from 'src/app/classes/hitbox';
import { FoolService } from 'src/app/services/fool-service/fool.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Session } from 'src/app/classes/session';
import { EnumResourceType } from 'put3-models';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';

@Component({
    selector: 'app-layout-editor',
    templateUrl: './layout-editor.component.html',
    styleUrls: ['./layout-editor.component.scss'],
})
export class LayoutEditorComponent implements OnInit, DashboardSection {

    @ViewChild('content')
    public content!: ElementRef;

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
        private foolService: FoolService,
        private dialog: MatDialog,
        private desktopService: DesktopService,
        public hitboxService: HitboxService
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
        const dialogRef = this.dialog.open(ResourceBrowserModal, {
            data: { type: EnumResourceType.IMAGE }
        });

        dialogRef.afterClosed().subscribe(image => {
            if (!image) return;
            this.target!.fool.layout.desktop.image = image.href;
        });
    }

    public sendConfig() {
        this.foolService.sendConfig(this.target!.fool);
    }
}
