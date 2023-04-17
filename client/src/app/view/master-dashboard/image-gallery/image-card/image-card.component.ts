import { Component, Input, OnInit } from '@angular/core';
import { FileData } from 'src/app/types/fileData';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss']
})
export class ImageCardComponent implements OnInit {

  @Input() image!: FileData;

  apiUrl = environment.serverUrl + '/' + environment.apiPath;

  constructor() { }

  ngOnInit(): void {
  }

}
