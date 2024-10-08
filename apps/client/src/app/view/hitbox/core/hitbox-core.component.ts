import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Hitbox } from 'src/app/classes/hitbox';
import { ChildElementsDirective } from 'src/app/directives/child-elements.directive';
import { Action } from 'src/app/interfaces/action';
import { ComponentLocation } from 'src/app/enums/component-location';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { ETrigger } from 'src/app/enums/trigger';
import { ComponentService } from 'src/app/services/component-service/component.service';

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

    constructor(
        private elementRef: ElementRef,
        private componentService: ComponentService,
        private desktopService: DesktopService
    ) { }

    ngOnInit(): void {
        // Get reference to the component container
        this.childElementsContainerRef = this.childElements.viewContainerRef;
        this.childElementsContainerRef.clear();

        const events = this.hitbox.events;
        // Generate interaction component for each trigger
        if(ETrigger.Default in events && events[ETrigger.Default])
            this.addComponent(events[ETrigger.Default]);
    }

    addComponent(action: Action) {
        let componentRef;
        const component = this.componentService.resolve(action.component.name)

        // Add the component to the correct location
        switch (action.location) {
            case ComponentLocation.Core:
                componentRef = this.childElementsContainerRef.createComponent<any>(component);
                break;

            case ComponentLocation.Desktop:
                componentRef = this.desktopService.containerRef.createComponent<any>(component);
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
        if(ETrigger.Hover in events && events[ETrigger.Hover])
            this.addComponent(events[ETrigger.Hover]);

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
        if(ETrigger.Click in events && events[ETrigger.Click])
            this.addComponent(events[ETrigger.Click]);

        this.singleClickEvent.emit();
    }

    private doubleClick() {
        const events = this.hitbox.events;
        if(ETrigger.DoubleClick in events && events[ETrigger.DoubleClick])
            this.addComponent(events[ETrigger.DoubleClick]);

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
