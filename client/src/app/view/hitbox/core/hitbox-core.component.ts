import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { ChildElementsDirective } from 'src/app/directives/child-elements.directive';
import { DesktopIconComponent } from '../../interaction/desktop-icon/desktop-icon.component';
import { Action } from 'src/app/interfaces/action';
import { ComponentLocation } from 'src/app/enums/component-location';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { ETrigger } from 'src/app/enums/trigger';

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
    if(ETrigger.Default in events && events.default)
      this.addComponent(events.default);
  }

  addComponent(action: Action) {
    let componentRef;

    // Add the component to the correct location
    switch (action.location) {
      case ComponentLocation.Core:
        componentRef = this.childElementsContainerRef.createComponent<any>(action.view);
        break;

      case ComponentLocation.Desktop:
        componentRef = this.desktopService.containerRef.createComponent<any>(action.view);
        break;
    }

    componentRef.instance.data = action.data;
    componentRef.instance.hoverEvent = this.hoverEvent;
    componentRef.instance.clickEvent = this.clickEvent;
    componentRef.instance.singleClickEvent = this.singleClickEvent;
    componentRef.instance.doubleClickEvent = this.doubleClickEvent;
    componentRef.instance.outsideClickEvent = this.outsideClickEvent;
  }

  mouseEnter() {
    const events = this.hitbox.events;
    if(ETrigger.Hover in events && events.hover)
      this.addComponent(events.hover);

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
    const events = this.hitbox.events;
    if(ETrigger.Click in events && events.click)
      this.addComponent(events.click);

    this.singleClickEvent.emit();
  }

  private doubleClick() {
    const events = this.hitbox.events;
    if(ETrigger.DoubleClick in events && events.doubleClick)
      this.addComponent(events.doubleClick);

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
