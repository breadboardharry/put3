import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action } from 'src/app/interfaces/action';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { Trigger } from 'src/app/interfaces/trigger';

@Component({
  selector: 'app-hitbox-settings',
  templateUrl: './hitbox-settings.component.html',
  styleUrls: ['./hitbox-settings.component.scss']
})
export class HitboxSettingsComponent implements OnInit {

  @Input() triggers!: Trigger[];
  @Input() actions!: Action[];
  @Input() hitbox!: Hitbox;
  @Input() hover!: boolean;
  @Output() hoverChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  assignAction(action: Action, trigger: Trigger) {
    this.hitbox.events[trigger.value] = action;
    this.mouseLeave();
  }

  mouseEnter(hover: boolean = true) {
    this.hoverChange.emit(hover)
  }

  mouseLeave() {
    this.hoverChange.emit(false);
  }
}
