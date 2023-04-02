import { Component, HostListener, Input, OnInit  } from '@angular/core';
import { Trigger } from 'src/app/interfaces/trigger';
import { Action } from 'src/app/interfaces/action';
import { Size } from 'src/app/interfaces/size';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { Position } from 'src/app/interfaces/position';

type ResizeHandle = 'none' | 'right' | 'bottom' | 'corner';

@Component({
  selector: 'app-hitbox',
  templateUrl: './hitbox.component.html',
  styleUrls: ['./hitbox.component.scss']
})
export class HitboxComponent implements OnInit {

  @Input() hitbox!: Hitbox;

  prevSize!: Size;

  constructor() {  }

  ngOnInit(): void {
    // Initialize the previous size
    this.prevSize = {
      width: this.hitbox.size.width,
      height: this.hitbox.size.height
    }
  }

  actions: Action[] = [
    { name: 'Action 1', value: 'action-1' },
    { name: 'Action 2', value: 'action-2' },
    { name: 'Action 3', value: 'action-3'}
  ];

  triggers: Trigger[] = [
    { name: 'Hover', value: 'hover' },
    { name: 'Clique', value: 'click' },
    { name: 'Double clique', value: 'double-click' }
  ];

  resizing: ResizeHandle = 'none';

  mouse: Position = { x: 0,  y: 0 }
  lastMouse: Position = { x: 0, y: 0 }

  dx: number = 0;
  dy: number = 0;

  hover: boolean = false;

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
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: any) {

    if (this.resizing === 'right' || this.resizing === 'corner')
      this.hitbox.size.width = this.prevSize.width + this.dx;

    if (this.resizing === 'bottom' || this.resizing === 'corner')
      this.hitbox.size.height = this.prevSize.height + this.dy;

    this.resizing = 'none';
  }

  selectAction(action: Action): void {
    this.hitbox.behavior.action = action;
    this.hover = false;
  }

  selectTrigger(trigger: Trigger): void {
    this.hitbox.behavior.trigger = trigger;
    this.hover = false;
  }

  mouseEnter() {
    this.hover = true;
  }

  mouseLeave() {
    this.hover = false;
  }
}
