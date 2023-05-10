import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {WindowsMenuService} from "../../../services/windows-service/windows-menu.service";
import {TriggerSource} from "../../../enums/trigger-sources";

@Component({
  selector: 'app-windows-menu',
  templateUrl: './windows-menu.component.html',
  styleUrls: ['./windows-menu.component.scss'],
  animations: [
    trigger('openClose', [
      state('opened', style({
        opacity: 1,
        zIndex: 100,
        transform: 'translateY(0%)'
      })),
      state('closed', style({
        opacity: 0,
        zIndex: -100,
        transform: 'translateY(10%)'
      })),
      transition('opened => closed', [
        animate('10ms 20ms')
      ]),
      transition('closed => opened', [
        animate('120ms 80ms ease-out')
      ])
    ])
  ]
})
export class WindowsMenuComponent implements OnInit {

  constructor(public windowsMenu: WindowsMenuService, private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isClickInside = this.elementRef.nativeElement.contains(clickedElement);

    // CLose the menu if the click is outside the menu and the last trigger source is not the button
    if (!isClickInside && this.windowsMenu.getTriggerSource() != TriggerSource.Button) {
      this.windowsMenu.close();
    }
  }
}
