import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { FileData } from 'src/app/types/file-data';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {

  images: FileData[] = [];
  selection: FileData[] = [];

  constructor(private assetsService: AssetsService) { }

  ngOnInit(): void {
    this.assetsService.getServerImages().then((data: FileData[]) => {
      this.images = data;
      console.log(this.images);
    });
  }

  select(image: FileData, event: any) {
    const index = this.selection.indexOf(image);

    if (event.ctrlKey) {
      if (index == -1) this.selection.push(image);
      else this.selection.splice(index, 1);
    }
    else {
      if (index == -1 || this.selection.length > 1) this.selection = [image];
      else this.selection = [];
    }
  }
}
