import { Component, OnInit } from '@angular/core';
import { HitboxService } from 'src/app/services/hitbox-service/hitbox.service';

@Component({
  selector: 'app-hitbox-container',
  templateUrl: './hitbox-container.component.html',
  styleUrls: ['./hitbox-container.component.scss']
})
export class HitboxContainerComponent implements OnInit {

  constructor(public hitboxService: HitboxService) { }

  ngOnInit(): void {
  }

}
