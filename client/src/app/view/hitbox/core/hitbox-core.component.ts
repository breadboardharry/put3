import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { ChildElementsDirective } from 'src/app/directives/child-elements.directive';
import { DesktopIconComponent } from '../../interaction/desktop-icon/desktop-icon.component';

@Component({
  selector: 'app-hitbox-core',
  templateUrl: './hitbox-core.component.html',
  styleUrls: ['./hitbox-core.component.scss']
})
export class HitboxCoreComponent implements OnInit {

  @ViewChild(ChildElementsDirective, {static: true}) childElements!: ChildElementsDirective;

  @Input() hitbox!: Hitbox;

  nbClick: number = 0;
  timeout!: any;
  doubleClickTimeout: number = 220;

  hoverEvent = new EventEmitter<boolean>();
  clickEvent = new EventEmitter();
  singleClickEvent = new EventEmitter();
  doubleClickEvent = new EventEmitter();
  outsideClickEvent = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.addComponent();
  }

  addComponent() {
    const viewContainerRef = this.childElements.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(DesktopIconComponent);
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
