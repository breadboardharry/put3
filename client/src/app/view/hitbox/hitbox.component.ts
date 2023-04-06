import { Component, HostListener, Input, OnInit  } from '@angular/core';
import { Trigger } from 'src/app/interfaces/trigger';
import { Action } from 'src/app/interfaces/action';
import { Size } from 'src/app/interfaces/size';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { Position } from 'src/app/interfaces/position';
import { CdkDragEnd } from "@angular/cdk/drag-drop";
import { DesktopIconComponent } from '../interaction/desktop-icon/desktop-icon.component';
import { ComponentLocation } from 'src/app/enums/component-location';
import { RickRollComponent } from '../interaction/rick-roll/rick-roll.component';
import { ETrigger } from 'src/app/enums/trigger';

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
    {
      name: 'Desktop Icon',
      value: 'desktop-icon',
      component: DesktopIconComponent,
      location: ComponentLocation.Core,
      triggers: [ETrigger.Default]
    },
    {
      name: 'Rick Roll',
      value: 'rick-roll',
      component: RickRollComponent,
      location: ComponentLocation.Desktop,
      triggers: [ETrigger.Click, ETrigger.DoubleClick]
    },
  ];

  triggers: Trigger[] = [
    {
      name: 'Défaut',
      value: ETrigger.Default,
    },
    {
      name: 'Hover',
      value: ETrigger.Hover,
    },
    {
      name: 'Clique',
      value: ETrigger.Click,
    },
    {
      name: 'Double clique',
      value: ETrigger.DoubleClick
    }
  ];

  resizing: ResizeHandle = 'none';

  mouse: Position = { x: 0,  y: 0 }
  lastMouse: Position = { x: 0, y: 0 }

  dx: number = 0;
  dy: number = 0;

  hover: boolean = false;
  settingsPos: 'top' | 'bottom' = 'bottom';

  dragEnd(event: CdkDragEnd) {
    let yPos = event.source.getRootElement().getBoundingClientRect().y;
    this.updateSettingsPanelPos(yPos);
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
}
