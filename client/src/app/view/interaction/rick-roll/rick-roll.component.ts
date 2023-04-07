import { Component, OnInit } from '@angular/core';
import { InteractionTemplateComponent } from '../template/interaction-template.component';

@Component({
  selector: 'app-rick-roll',
  templateUrl: './rick-roll.component.html',
  styleUrls: ['./rick-roll.component.scss']
})
export class RickRollComponent extends InteractionTemplateComponent {

  constructor() {
    super();
  }

  onHover(hover: boolean): void {
  }

  onClick(): void {
  }

  onSingleClick(): void {
  }

  onDoubleClick(): void {
  }

  onOutsideClick(): void {
  }
}
