import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-interaction-template',
  template: '',
  styles: []
})
export abstract class InteractionTemplateComponent implements OnInit {

  @Input() hoverEvent: any;
  @Input() clickEvent: any;
  @Input() singleClickEvent: any;
  @Input() doubleClickEvent: any;
  @Input() outsideClickEvent: any;

  constructor() { }

  ngOnInit(): void {
    this.hoverEvent.subscribe((hover: boolean) => this.onHover(hover));
    this.clickEvent.subscribe(() => this.onClick());
    this.singleClickEvent.subscribe(() => this.onSingleClick());
    this.doubleClickEvent.subscribe(() => this.onDoubleClick());
    this.outsideClickEvent.subscribe(() => this.onOutsideClick());
  }

  abstract onHover(hover: boolean): void;
  abstract onClick(): void;
  abstract onSingleClick(): void;
  abstract onDoubleClick(): void;
  abstract onOutsideClick(): void;

}
