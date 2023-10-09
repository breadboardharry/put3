import {Component, OnInit} from '@angular/core';
import {WindowsMenuService} from "../../../services/windows-service/windows-menu.service";
import {TriggerSource} from "../../../enums/trigger-sources";

@Component({
  selector: 'app-windows-button',
  templateUrl: './windows-button.component.html',
  styleUrls: ['./windows-button.component.scss']
})
export class WindowsButtonComponent implements OnInit {

  menuOpened: boolean = false;

  constructor(private windowsMenu: WindowsMenuService) { }

  ngOnInit(): void {
  }

  openWindowsMenu() {
    this.windowsMenu.toggle(TriggerSource.Button);
  }
}
