import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Menu } from 'src/app/types/menu';
import { MenuItem } from 'src/app/types/menu-item';

@Component({
  selector: 'app-master-dashboard-navbar',
  templateUrl: './master-dashboard-navbar.component.html',
  styleUrls: ['./master-dashboard-navbar.component.scss']
})
export class MasterDashboardNavbarComponent implements OnInit {

  @Input() selectedItem!: MenuItem;
  @Output() selectedItemEvent: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  menus: Menu[] = [
    [
      {
        title: 'Layout',
        icon: 'edit-image.png'
      },
      {
        title: 'Soundboard',
        icon: 'speaker.png'
      },
      {
        title: 'Images',
        icon: 'photo-gallery.png'
      }
    ],
    [
      {
        title: 'Settings',
        icon: 'gear.png'
      }
    ]
  ]

  constructor() { }

  ngOnInit(): void {
  }

  selectItem(item: MenuItem) {
    this.selectedItem = item;
    this.selectedItemEvent.emit(item);
  }
}
