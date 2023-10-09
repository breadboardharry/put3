import { Injectable } from '@angular/core';
import { TriggerSource } from '../../enums/trigger-sources';

@Injectable({
  providedIn: 'root'
})
export class WindowsMenuService {

  private opened: boolean = false;
  private triggerSource: TriggerSource = TriggerSource.Unknown;

  constructor() {
  }

  public toggle(source: TriggerSource = TriggerSource.Unknown) {
    this.opened = !this.opened;
    this.triggerSource = source;
  }

  public open(source: TriggerSource = TriggerSource.Unknown) {
    this.opened = true;
    this.triggerSource = source;
  }

  public close(source: TriggerSource = TriggerSource.Unknown) {
    this.opened = false;
    this.triggerSource = source;
  }

  public isOpened() {
    return this.opened;
  }

  public getTriggerSource() {
    const source = this.triggerSource;
    this.triggerSource = TriggerSource.Unknown;
    return source;
  }
}
