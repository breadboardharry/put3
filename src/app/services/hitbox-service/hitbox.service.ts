import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Button {
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class HitboxService {

  private buttons: Button[] = [
    { label: 'Button 1' },
  ];

  constructor() { }

  public addNew() {
    this.buttons.push({ label: 'Button ' + (this.buttons.length + 1) });
  }

  public get list() {
    return this.buttons;
  }
}
