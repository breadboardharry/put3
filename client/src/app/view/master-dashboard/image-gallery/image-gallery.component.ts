import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { FileData } from 'src/app/types/fileData';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {

  images: FileData[] = [];

  constructor(private assetsService: AssetsService) { }

  ngOnInit(): void {
    this.assetsService.getServerImages().then((data: FileData[]) => {
      this.images = data;
    });
  }
}
