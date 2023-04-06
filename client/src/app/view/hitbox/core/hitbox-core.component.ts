import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { ChildElementsDirective } from 'src/app/directives/child-elements.directive';
import { DesktopIconComponent } from '../../interaction/desktop-icon/desktop-icon.component';
import { Action } from 'src/app/interfaces/action';
import { ComponentLocation } from 'src/app/enums/component-location';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';

@Component({
  selector: 'app-hitbox-core',
  templateUrl: './hitbox-core.component.html',
  styleUrls: ['./hitbox-core.component.scss']
})
export class HitboxCoreComponent implements OnInit {

  @ViewChild(ChildElementsDirective, {static: true}) childElements!: ChildElementsDirective;
  childElementsContainerRef!: ViewContainerRef;

  @Input() hitbox!: Hitbox;

  nbClick: number = 0;
  timeout!: any;
  doubleClickTimeout: number = 220;

  hoverEvent = new EventEmitter<boolean>();
  clickEvent = new EventEmitter();
  singleClickEvent = new EventEmitter();
  doubleClickEvent = new EventEmitter();
  outsideClickEvent = new EventEmitter();

  constructor(private elementRef: ElementRef, private desktopService: DesktopService) { }

  ngOnInit(): void {
    // Get reference to the component container
    this.childElementsContainerRef = this.childElements.viewContainerRef;
    this.childElementsContainerRef.clear();

    const events = this.hitbox.events;

    // Generate interaction component for each trigger
    if('hover' in events && events.hover)
      this.addComponent(events.hover);

    if('click' in events && events.click)
      this.addComponent(events.click);

    if('doubleClick' in events && events.doubleClick)
      this.addComponent(events.doubleClick);

  }

  addComponent(action: Action) {
    let componentRef;

    // Add the component to the correct location
    switch (action.location) {
      case ComponentLocation.Core:
        componentRef = this.childElementsContainerRef.createComponent<any>(action.component);
        break;

      case ComponentLocation.Desktop:
        componentRef = this.desktopService.containerRef.createComponent<any>(action.component);
        break;
    }

    componentRef.instance.hoverEvent = this.hoverEvent;
    componentRef.instance.clickEvent = this.clickEvent;
    componentRef.instance.singleClickEvent = this.singleClickEvent;
    componentRef.instance.doubleClickEvent = this.doubleClickEvent;
    componentRef.instance.outsideClickEvent = this.outsideClickEvent;
  }

  mouseEnter() {
    this.hoverEvent.emit(true);
  }

  mouseLeave() {
    this.hoverEvent.emit(false);
  }

  click() {
    this.clickEvent.emit();

    clearTimeout(this.timeout);

    // Double click
    if (++this.nbClick > 1) {
      this.nbClick = 0;
      this.doubleClick();
    }

    // Single click
    else {
      this.timeout = setTimeout(() => {
        this.nbClick = 0;
        this.singleClick();
      },
      this.doubleClickTimeout);
    }
  }

  private singleClick() {
    this.singleClickEvent.emit();
  }

  private doubleClick() {
    this.doubleClickEvent.emit();
  }

  private outsideClick() {
    this.outsideClickEvent.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isClickInside = this.elementRef.nativeElement.contains(clickedElement);

    // CLose the menu if the click is outside the menu and the last trigger source is not the button
    if (!isClickInside) {
      this.outsideClick();
    }
  }
}
