import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AssetsService } from 'src/app/services/assets-service/assets.service';

@Component({
    selector: 'app-drag-drop',
    templateUrl: './drag-drop.component.html',
    styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
    fileArr: any[] = [];
    imgArr: any[] = [];
    fileObj: any[] = [];
    form: FormGroup;
    msg: string = '';
    progress: number = 0;

    constructor(
        public fb: FormBuilder,
        private sanitizer: DomSanitizer,
        public assetsService: AssetsService
    ) {
        this.form = this.fb.group({
            file: [null],
        });
    }

    ngOnInit() {}

    upload(e: any) {
        const fileListAsArray = Array.from(e);
        fileListAsArray.forEach((item, i) => {
            const file: any = e as HTMLInputElement;
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
        this.assetsService.addFiles(this.form.value.file)
            .subscribe((event: HttpEvent<any>) => {
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

    // Clean Url
    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}
