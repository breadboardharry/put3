import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-dashboard-fool-card',
  templateUrl: './master-dashboard-fool-card.component.html',
  styleUrls: ['./master-dashboard-fool-card.component.scss']
})
export class MasterDashboardFoolCardComponent implements OnInit {

  @Input() fool!: any;
  @Input() selected?: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
