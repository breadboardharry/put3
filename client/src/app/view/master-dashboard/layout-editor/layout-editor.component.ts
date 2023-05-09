import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';

@Component({
    selector: 'app-layout-editor',
    templateUrl: './layout-editor.component.html',
    styleUrls: ['./layout-editor.component.scss'],
})
export class LayoutEditorComponent implements OnInit {

    @ViewChild('content') content!: ElementRef;
    @Input() fools: any[] = [];
    @Input() target!: any;
    @Input() disabled: boolean = false;

    desktopBackground: string = 'assets/images/default-desktop-background.jpg';

    constructor(private desktopService: DesktopService) {}

    ngOnInit(): void {
        // Get desktop background image
        this.desktopService.getBackground().then((image) => {
            this.desktopBackground = image;
        });
    }

    isWindowDefined(): boolean {
        return this.target && this.target.data && this.target.data.window;
    }

    addHitbox() {
        console.log('add hitbox');
    }
}
