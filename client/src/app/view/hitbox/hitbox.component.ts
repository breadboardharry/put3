import { Component, HostListener, Input, OnInit  } from '@angular/core';
import { Size } from 'src/app/types/size';
import { Hitbox } from 'src/app/classes/hitbox';
import { Position } from 'src/app/types/position';
import { CdkDragEnd } from "@angular/cdk/drag-drop";
import { triggers } from 'src/app/data/triggers'
import { actions } from 'src/app/data/actions'
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';
import { ResizeHandle } from 'src/app/types/resize-handle';

@Component({
    selector: 'app-hitbox',
    templateUrl: './hitbox.component.html',
    styleUrls: ['./hitbox.component.scss']
})
export class HitboxComponent implements OnInit {

    @Input() hitbox!: Hitbox;
    @Input() disabled: boolean = false;

    triggers = triggers;
    actions = actions;

    // Resize and drag variables
    resizing: ResizeHandle = 'none';
    prevSize!: Size;
    mouse: Position = { x: 0,  y: 0 }
    lastMouse: Position = { x: 0, y: 0 }
    dx: number = 0;
    dy: number = 0;

    hover: boolean = false;
    settingsPos: 'top' | 'bottom' = 'bottom';

    constructor(private hitboxService: HitboxService) {  }

    ngOnInit(): void {
        // Initialize the previous size
        this.prevSize = {
            width: this.hitbox.size.width,
            height: this.hitbox.size.height
        }
    }

    /**
     * Drag end event
     * @description When the user stops dragging the hitbox, update the position
     * @param event
     */
    dragEnd(event: CdkDragEnd) {
        const yPos = event.source.getRootElement().getBoundingClientRect().y;
        this.updateSettingsPanelPos(yPos);

        const position = event.source.getFreeDragPosition();
        this.hitbox.position.x = this.hitbox.position.x + this.hitboxService.toXpercent(position.x);
        this.hitbox.position.y = this.hitbox.position.y + this.hitboxService.toYpercent(position.y);

        // Reset the default transform
        event.source._dragRef.reset();
    }

    /**
     * Resize start event
     * @description When the user starts resizing the hitbox, update the size
     * @param handle The handle used
     */
    resizeStart(handle: ResizeHandle): void {
        this.resizing = handle;
        this.lastMouse = this.mouse;
        this.prevSize.width = this.hitbox.size.width;
        this.prevSize.height = this.hitbox.size.height;
    }

    /**
     * Resizing
     * @description When the user is resizing the hitbox, update the size in real time
     * @param event Mouse event
     */
    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.mouse = {  x: event.clientX, y: event.clientY };

        if (this.resizing === 'right' || this.resizing === 'corner') {
            this.dx = this.mouse.x - this.lastMouse.x;
            this.hitbox.size.width = this.prevSize.width + this.hitboxService.toXpercent(this.dx);

            // Prevent the hitbox from going off screen
            if (this.hitbox.size.width + this.hitbox.position.x > 100) {
                this.hitbox.size.width = 100 - this.hitbox.position.x;
            }
        }

        if (this.resizing === 'bottom' || this.resizing === 'corner') {
            this.dy = this.mouse.y - this.lastMouse.y;
            this.hitbox.size.height = this.prevSize.height + this.hitboxService.toYpercent(this.dy);

            // Prevent the hitbox from going off screen
            if (this.hitbox.size.height + this.hitbox.position.y > 100) {
                this.hitbox.size.height = 100 - this.hitbox.position.y;
            }

            this.updateSettingsPanelPos(this.mouse.y - this.hitbox.size.height);
        }
    }

    /**
     * Resize end event
     * @description When the user stops resizing the hitbox, update the size
     * @param event Mouse event
     */
    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {

        if (this.resizing === 'right' || this.resizing === 'corner')
            this.hitbox.size.width = this.prevSize.width + this.hitboxService.toXpercent(this.dx);

            // Prevent the hitbox from going off screen
            if (this.hitbox.size.width + this.hitbox.position.x > 100) {
                this.hitbox.size.width = 100 - this.hitbox.position.x;
            }

        if (this.resizing === 'bottom' || this.resizing === 'corner') {
            this.hitbox.size.height = this.prevSize.height + this.hitboxService.toYpercent(this.dy);

            // Prevent the hitbox from going off screen
            if (this.hitbox.size.height + this.hitbox.position.y > 100) {
                this.hitbox.size.height = 100 - this.hitbox.position.y;
            }

            this.updateSettingsPanelPos(this.mouse.y - this.hitbox.size.height);
        }

        this.resizing = 'none';
    }

    mouseEnter(hover: boolean = true) {
        this.hover = hover;
    }

    mouseLeave() {
        this.hover = false;
    }

    updateSettingsPanelPos(yPos: number) {
        const windowHeight = window.innerHeight;
        this.settingsPos = windowHeight-(yPos + this.hitbox.size.height) <= 160 ? 'top' : 'bottom';
  }
}
