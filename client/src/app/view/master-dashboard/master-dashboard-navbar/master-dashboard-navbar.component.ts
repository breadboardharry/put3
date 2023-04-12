import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-dashboard-navbar',
  templateUrl: './master-dashboard-navbar.component.html',
  styleUrls: ['./master-dashboard-navbar.component.scss']
})
export class MasterDashboardNavbarComponent implements OnInit {

  items = {
    menu: [
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
    bottom: [
      {
        title: 'Settings',
        icon: 'gear.png',
        location: 'bottom'
      }
    ]
  }

  constructor() { }

  ngOnInit(): void {
  }

}
