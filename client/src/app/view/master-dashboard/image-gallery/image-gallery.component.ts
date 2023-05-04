import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { FileData } from 'src/app/types/file-data';

@Component({
    selector: 'app-image-gallery',
    templateUrl: './image-gallery.component.html',
    styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {

    images: FileData[] = [];
    selection: FileData[] = [];

    fileArr: any[] = [];
    imgArr: any[] = [];
    fileObj: any[] = [];
    form: FormGroup;
    msg: string = '';
    progress: number = 0;
    uploading: boolean = false

    constructor(private websocket: WebSocketService, private assetsService: AssetsService, public fb: FormBuilder, private sanitizer: DomSanitizer) {
        this.form = this.fb.group({
            file: [null],
        });
    }

    ngOnInit(): void {
        this.updateAssets();

        this.websocket.socket.on('event', (data: any) => {
            if (data.type != 'assets') return;
            this.updateAssets();
        });
    }

    updateAssets() {
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
        } else {
            if (index == -1 || this.selection.length > 1)
                this.selection = [image];
            else this.selection = [];
        }
    }

    upload(event: any) {
        const fileListAsArray = Array.from(event);
        fileListAsArray.forEach((item, i) => {
            const file: any = event as HTMLInputElement;
            const url: any = URL.createObjectURL(file[i]);
            this.imgArr.push(url);
            this.fileArr.push({ item, url: url });
        });
        this.fileArr.forEach((item) => {
            this.fileObj.push(item.item);
        });
        // Set files form control
        this.form.patchValue({
            file: this.fileObj,
        });
        this.form.get('file')!.updateValueAndValidity();
        // Upload to server
        this.uploading = true;
        this.assetsService.addFiles(this.form.value.file)
            .subscribe((event: HttpEvent<any>) => {
                console.log('done');
                switch (event.type) {
                    case HttpEventType.Sent:
                        console.log('Request has been made!');
                        break;

                    case HttpEventType.ResponseHeader:
                        console.log('Response header has been received!');
                        break;

                    case HttpEventType.UploadProgress:
                        this.progress = Math.round(
                            (event.loaded / event.total!) * 100
                        );
                        console.log(`Uploaded! ${this.progress}%`);
                        break;

                    case HttpEventType.Response:
                        this.uploading = false;
                        console.log('File uploaded successfully!', event.body);
                        setTimeout(() => {
                            this.progress = 0;
                            this.fileArr = [];
                            this.fileObj = [];
                            this.msg = 'File uploaded successfully!';
                        }, 3000);
                }
            });
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}
