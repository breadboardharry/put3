import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ETrigger } from 'src/app/enums/trigger';
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
    // Check if this action is already assigned
    if(this.hitbox.events[trigger.value]) {
      delete this.hitbox.events[trigger.value];
    }
    else {
      this.hitbox.events[trigger.value] = action;
    }

    this.mouseLeave();
  }

  mouseEnter(hover: boolean = true) {
    this.hoverChange.emit(hover)
  }

  mouseLeave() {
    this.hoverChange.emit(false);
  }

  isDisabled(trigger: Trigger): boolean {
    let isTriggerUsed: boolean = false;

    // Check if at least one action can be associated with this trigger
    for(let action of this.actions) {

      if(action.triggers.includes(trigger.value)) {
        isTriggerUsed = true;
        break;
      }
    }

    // Disable if no trigger can be assigned to this trigger
    if(!isTriggerUsed) return true;

    // For each assigned action
    for(let action of Object.values(this.hitbox.events) as Action[]) {
      // Check if this action blocks this trigger
      if('lockedTriggers' in action && action.lockedTriggers &&
      action.lockedTriggers.includes(trigger.value)) {
        return true;
      }
    }

    // Everythings OK
    return false;
  }

  isActionEnabled(action: Action, trigger: Trigger): boolean {
    return action.triggers.includes(ETrigger.All) || action.triggers.includes(trigger.value);
  }
}
