import { Component, HostListener, Input, OnInit  } from '@angular/core';
import { Size } from 'src/app/interfaces/size';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { Position } from 'src/app/interfaces/position';
import { CdkDragEnd, CdkDragStart } from "@angular/cdk/drag-drop";
import { triggers } from 'src/app/data/triggers'
import { actions } from 'src/app/data/actions'
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';

type ResizeHandle = 'none' | 'right' | 'bottom' | 'corner';

@Component({
  selector: 'app-hitbox',
  templateUrl: './hitbox.component.html',
  styleUrls: ['./hitbox.component.scss']
})
export class HitboxComponent implements OnInit {

  @Input() hitbox!: Hitbox;

  triggers = triggers;
  actions = actions;

  prevSize!: Size;

    constructor() {  }

  ngOnInit(): void {
    // Initialize the previous size
    this.prevSize = {
      width: this.hitbox.size.width,
      height: this.hitbox.size.height
    }
  }

  resizing: ResizeHandle = 'none';

  mouse: Position = { x: 0,  y: 0 }
  lastMouse: Position = { x: 0, y: 0 }

  dx: number = 0;
  dy: number = 0;

  hover: boolean = false;
  settingsPos: 'top' | 'bottom' = 'bottom';

  dragStart(event: CdkDragStart) {
    console.log(event.source.getFreeDragPosition());
  }

  dragEnd(event: CdkDragEnd) {
    let yPos = event.source.getRootElement().getBoundingClientRect().y;
    this.updateSettingsPanelPos(yPos);
    const position = event.source.getFreeDragPosition();
    this.hitbox.position.x = position.x;
    this.hitbox.position.y = position.y;
    console.log(event.source.getFreeDragPosition());
  }

  resizeStart(handle: ResizeHandle): void {
    this.resizing = handle;
    this.lastMouse = this.mouse;
    this.prevSize.width = this.hitbox.size.width;
    this.prevSize.height = this.hitbox.size.height;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse = {
      x: event.clientX,
      y: event.clientY
    }

    if (this.resizing === 'right' || this.resizing === 'corner') {
      this.dx = this.mouse.x - this.lastMouse.x;
      this.hitbox.size.width = this.prevSize.width + this.dx;
    }

    if (this.resizing === 'bottom' || this.resizing === 'corner') {
      this.dy = this.mouse.y - this.lastMouse.y;
      this.hitbox.size.height = this.prevSize.height + this.dy;
      this.updateSettingsPanelPos(this.mouse.y - this.hitbox.size.height);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: any) {

    if (this.resizing === 'right' || this.resizing === 'corner')
      this.hitbox.size.width = this.prevSize.width + this.dx;

    if (this.resizing === 'bottom' || this.resizing === 'corner') {
      this.hitbox.size.height = this.prevSize.height + this.dy;
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
    let windowHeight = window.innerHeight;

    this.settingsPos = windowHeight-(yPos + this.hitbox.size.height) <= 160 ? 'top' : 'bottom';
  }

    get style() {
        return this.hitbox.active ? {
            'width.%': 100,
            'height.%': 100,
        } : {
            'width.px': this.hitbox.size.width,
            'height.px': this.hitbox.size.height,
        };
    }
}
