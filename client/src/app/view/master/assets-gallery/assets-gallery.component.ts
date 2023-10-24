import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileData } from 'put3-models';
import { ContextMenuAction } from 'src/app/enums/context-menu-action';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { SelectionService } from 'src/app/services/selection-service/selection.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { ContextMenu } from 'src/app/types/context-menu';

@Component({
    selector: 'app-assets-gallery',
    templateUrl: './assets-gallery.component.html',
    styleUrls: ['./assets-gallery.component.scss'],
})
export class AssetsGalleryComponent implements OnInit {

    @Input()
    isAdmin: boolean = false;

    // Context menu
    public contextMenu: ContextMenu = {
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
    public editing: FileData | null = null;

    // File upload
    fileArr: any[] = [];
    imgArr: any[] = [];
    fileObj: any[] = [];
    form: FormGroup;
    msg: string = '';
    progress: number = 0;
    uploading: boolean = false;

    constructor(
        private snackbar: SnackbarService,
        public selectionService: SelectionService,
        public resourceService: ResourcesService,
        public formBuilder: FormBuilder,
    ) {
        this.form = this.formBuilder.group({
            file: [null],
        });
    }

    ngOnInit(): void {
        this.selectionService.init(this.resourceService.getResources(), true);
    }

    select(file: FileData, event: any, rightClick: boolean = false) {
        this.selectionService.handleSelect(event, file, rightClick);

        // On right click, display context menu
        if (rightClick && this.isAdmin) {
            this.displayContextMenu(event);
        }
    }

    public upload(event: any) {
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
        this.resourceService.addFiles(this.form.value.file)
            .subscribe((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        console.log('[-] Request has been made!');
                        break;

                    case HttpEventType.ResponseHeader:
                        console.log('[-] Response header has been received!');
                        break;

                    case HttpEventType.UploadProgress:
                        this.progress = Math.round(
                            (event.loaded / event.total!) * 100
                        );
                        console.log(`[-] Uploaded! ${this.progress}%`);
                        break;

                    case HttpEventType.Response:
                        this.uploading = false;
                        console.log('[-] File uploaded successfully!', event.body);
                        setTimeout(() => {
                            this.progress = 0;
                            this.fileArr = [];
                            this.fileObj = [];
                            this.msg = 'File uploaded successfully!';
                        }, 3000);
                }
            });
    }

    private displayContextMenu(event: any) {
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

    public handleContextMenu(event: any) {
        this.contextMenu.show = false;
        if (!this.isAdmin) return;

        switch (event.item.action) {
            case ContextMenuAction.DELETE:
                const filespath = this.selectionService.getSelection().map((item: FileData) => item.path);
                this.resourceService.delete(filespath);
                break;

            case ContextMenuAction.RENAME:
                this.editing = this.selectionService.getSelection()[0];
                break;
        };
    }

    public rename(newName: string, file: FileData) {
        this.editing = null;

        // Stop here if the name hasn't changed
        if (newName == file.name) return;

        this.resourceService.rename( file.name, newName, file.dirpath )
            .then((res) => {
                    this.snackbar.openSuccess(file.name + " renamed to " + newName);
                },
                (err) => {
                    if (!err.error.message) return;

                    switch (err.error.message.toLowerCase()) {
                        case "file already exists":
                            this.snackbar.openError(newName + " already exists");
                            break;

                        case "invalid file extension":
                            this.snackbar.openError(err.error.message);
                            break;

                        case "invalid parameters":
                            this.snackbar.openError("Invalid filename");
                            break;
                    }

                    this.editing = file;
                }
        );
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
