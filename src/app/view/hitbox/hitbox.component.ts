import { Component, HostListener, OnInit } from '@angular/core';

type ResizeHandle = 'none' | 'right' | 'bottom' | 'corner';

interface Size {
  width: number;
  height: number;
}

@Component({
  selector: 'app-hitbox',
  templateUrl: './hitbox.component.html',
  styleUrls: ['./hitbox.component.scss']
})
export class HitboxComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  size: Size = {
    width: 200,
    height: 150
  }

  prevSize: Size = {
    width: this.size.width,
    height: this.size.height
  }

  resizing: ResizeHandle = 'none';

  lastMouse = {
    x: 0,
    y: 0
  }

  mouse = {
    x: 0,
    y: 0
  }

  dx: number = 0;
  dy: number = 0;

  resizeStart(handle: ResizeHandle): void {
    this.resizing = handle;
    this.lastMouse = this.mouse;
    this.prevSize.width = this.size.width;
    this.prevSize.height = this.size.height;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse = {
      x: event.clientX,
      y: event.clientY
    }

    if (this.resizing === 'right' || this.resizing === 'corner') {
      this.dx = this.mouse.x - this.lastMouse.x;
      this.size.width = this.prevSize.width + this.dx;
    }

    if (this.resizing === 'bottom' || this.resizing === 'corner') {
      this.dy = this.mouse.y - this.lastMouse.y;
      this.size.height = this.prevSize.height + this.dy;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: any) {

    if (this.resizing === 'right' || this.resizing === 'corner')
      this.size.width = this.prevSize.width + this.dx;

    if (this.resizing === 'bottom' || this.resizing === 'corner')
      this.size.height = this.prevSize.height + this.dy;

    this.resizing = 'none';
  }
}
