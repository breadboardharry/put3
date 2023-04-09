import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { assets } from 'src/app/data/assets';
import { ETrigger } from 'src/app/enums/trigger';
import { Action } from 'src/app/interfaces/action';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { Trigger } from 'src/app/interfaces/trigger';
import { AssetsService } from 'src/app/services/assets-service/assets.service';

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

  constructor(public assetsService: AssetsService) { }

  ngOnInit(): void { }

  assignAction(event: any, action: Action, trigger: Trigger, data: any = {}) {
    // Set data to action
    action.data = {...data};

    const currentAction = this.hitbox.events[trigger.value];
    // Remove assigned action if click on the same
    if(currentAction === action) {
      delete this.hitbox.events[trigger.value];
    }
    // Else, assign the new action
    else {
      this.hitbox.events[trigger.value] = {...action};
    }

    this.mouseLeave();
    event.stopPropagation();
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
