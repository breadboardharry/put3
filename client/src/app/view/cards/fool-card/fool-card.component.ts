import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fool-card',
  templateUrl: './fool-card.component.html',
  styleUrls: ['./fool-card.component.scss']
})
export class FoolCardComponent implements OnInit {

  @Input() fool!: any;
  @Input() selected?: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
