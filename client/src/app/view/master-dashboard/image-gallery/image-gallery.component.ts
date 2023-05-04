import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ContextMenuAction } from 'src/app/enums/context-menu-action';
import { AssetsService } from 'src/app/services/assets-service/assets.service';
import { SelectionService } from 'src/app/services/selection-service/selection.service';
import { WebSocketService } from 'src/app/services/websocket-service/websocket.service';
import { ContextMenuItem } from 'src/app/types/context-menu-item';
import { FileData } from 'src/app/types/file-data';

type ContextMenu = {
    show: boolean;
    x: number;
    y: number;
    style: any;
    items: ContextMenuItem[];
}

@Component({
    selector: 'app-image-gallery',
    templateUrl: './image-gallery.component.html',
    styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {

    // Context menu
    contextMenu: ContextMenu = {
        show: false,
        x: 0,
        y: 0,
        style: {
            position: 'fixed',
            top: '0px',
            left: '0px'
        },
        items: []
    };

    // Assets
    images: FileData[] = [];

    // File upload
    fileArr: any[] = [];
    imgArr: any[] = [];
    fileObj: any[] = [];
    form: FormGroup;
    msg: string = '';
    progress: number = 0;
    uploading: boolean = false

    constructor(public selectionService: SelectionService, private websocket: WebSocketService, private assetsService: AssetsService, public fb: FormBuilder, private sanitizer: DomSanitizer) {
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
            this.selectionService.init(this.images);
        });
    }

    select(image: FileData, event: any, rightClick: boolean = false) {
        this.selectionService.handleSelect(event, image, rightClick);

        // On right click, display context menu
        if (rightClick) {
            this.displayContextMenu(event);
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

    displayContextMenu(event: any) {
        this.contextMenu.show = true;
        const len = this.selectionService.getSelection().length

        this.contextMenu.items = [
            {
                title: "Delete" + (len > 1 ? ` (${len})` : ''),
                action: ContextMenuAction.DELETE,
                disabled: len == 0
            },
            {
                title: "Rename",
                action: ContextMenuAction.RENAME,
                disabled: len != 1
            }
        ];

        this.contextMenu.x = event.clientX;
        this.contextMenu.y = event.clientY;
        this.contextMenu.style.left = event.clientX + 1 + 'px';
        this.contextMenu.style.top = event.clientY + 'px';
    }

    handleContextMenu(event: any) {
        console.log('context menu clicked', event);
        this.contextMenu.show = false;

        switch (event.item.action) {
            case ContextMenuAction.DELETE:
                console.log("DELETE");
                const images = this.selectionService.getSelection().map((item: FileData) => item.name);
                this.assetsService.deleteImages(images).then((res) => {
                    console.log(res);
                });
                break;

            case ContextMenuAction.RENAME:
                break;
        };
    }

    @HostListener('document:click')
    documentClick(): void {
        this.contextMenu.show = false;
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: any) {
        // Click outside a card
        if (!event.target.className.includes('card')) {
            this.contextMenu.show = false;
        }

        event.preventDefault();
    }
}
