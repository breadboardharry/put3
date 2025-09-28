import { Component } from '@angular/core';
import { EnumCursorStyle } from 'src/app/enums/cursor-style';
import { CursorService } from 'src/app/services/cursor-service/cursor.service';
import { InteractionTemplateComponent } from '../template/interaction-template.component';

@Component({
    selector: 'app-desktop-icon',
    templateUrl: './desktop-icon.component.html',
    styleUrls: ['./desktop-icon.component.scss'],
})
export class DesktopIconComponent extends InteractionTemplateComponent {
    hover: boolean = false;
    focus: boolean = false;

    clickTimeout!: any;
    clicking: boolean = false;
    loading: boolean = false;

    constructor(private cursorService: CursorService) {
        super();
    }

    init() {}

    onHover(hover: boolean) {
        this.hover = hover;
    }

    onClick() {
        if (this.focus) return;
        this.focus = true;
        this.clicking = true;
        setTimeout(() => {
            this.clicking = false;
        }, 250);
    }

    onSingleClick() {
        if (this.focus && !this.clicking) this.focus = false;
    }

    onDoubleClick() {
        this.loading = true;
        this.focus = false;
        this.cursorService.setStyle(EnumCursorStyle.Progress, 2000).then(() => {
            this.loading = false;
        });
    }

    onOutsideClick() {
        this.focus = false;
    }
}
