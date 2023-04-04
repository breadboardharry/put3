import { Component, Input, OnInit } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';

@Component({
  selector: 'app-hitbox-core',
  templateUrl: './hitbox-core.component.html',
  styleUrls: ['./hitbox-core.component.scss']
})
export class HitboxCoreComponent implements OnInit {

  @Input() hitbox!: Hitbox;
  
  nbClick: number = 0;
  timeout!: any;
  doubleClickTimeout: number = 250;

  constructor() { }

  ngOnInit(): void {
  }

  mouseEnter() {
    console.log('mouse enter');
  }

  mouseLeave() {
    console.log('mouse leave');
  }

  click() {
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
    console.log('single click');
  }

  private doubleClick() {
    console.log('double click');
  }
}
