import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnumResourceType, FileData } from 'put3-models';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { SelectionService } from 'src/app/services/selection-service/selection.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { FileService } from 'src/app/services/utils/file-service/file.service';

@Component({
    selector: 'app-resource-browser',
    templateUrl: './resource-browser.modal.html',
    styleUrls: ['./resource-browser.modal.scss'],
})
export class ResourceBrowserModal implements OnInit {

    public type?: EnumResourceType;
    public canImport: boolean = false;
    public selectedMenu: 'resources' | 'import' = 'resources';
    public importedFile?: FileData;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ResourceBrowserModal>,
        public resourceService: ResourcesService,
        public selectionService: SelectionService,
        private fileService: FileService,
        private snackbar: SnackbarService
    ) {}

    ngOnInit(): void {
        if (this.data) {
            this.type = this.data.type || undefined;
            this.canImport = this.data.canImport || false;
        }

        this.selectionService.init(this.resourceService.getResources(this.type), false);
    }

    public menu(menu: 'resources' | 'import') {
        if (menu == 'resources') {
            this.resetImport();
        }
        else {
            this.selectionService.clear();
        }
        this.selectedMenu = menu;
    }

    public select(file: FileData, event: any, rightClick: boolean = false) {
        this.selectionService.handleSelect(event, file, rightClick);
    }

    public validate(file?: FileData, event?: any) {
        if (file && event) this.selectionService.handleSelect(event, file, false);
        this.close();
    }

    public close() {
        if (this.selectedMenu == 'resources') {
            const file = this.selectionService.getSelection()[0];
            this.dialogRef.close(file);
            return;
        }
        const file = this.importedFile;
        this.dialogRef.close(file);
    }

    public get canValidate(): boolean {
        return this.selectedMenu == 'resources' ? !!this.selectionService.getSelection().length : !!this.importedFile;
    }

    public fileChanged(event: any) {
        const file = event.target.files[0];
        const extension = this.fileService.getExtension(file.name);
        if (!extension || !this.allowedExtensions.includes(`.${extension}`) || !file.type.startsWith('image/')) {
            this.snackbar.openError(`File type not allowed.`);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            this.importedFile = {
                href: reader.result as string,
                type: this.type!,
                dirpath: '',
                extension: extension,
                name: this.fileService.removeExtension(file.name),
                path: '',
                size: file.size,
                isBase64: true,
            };
        };
        reader.onerror = () => {
            this.snackbar.openError('Error reading file');
            this.importedFile = undefined;
        };
        reader.readAsDataURL(file);
    }

    public get acceptedExtensions(): string {
        const extensions = this.allowedExtensions;
        if (!extensions.length) return '';
        return extensions.join(', ');
    }

    public get allowedExtensions(): string[] {
        if (!this.type) return [];
        switch (this.type) {
            case EnumResourceType.IMAGE:
                return ['.png', '.jpg', '.jpeg', '.gif'];
            case EnumResourceType.VIDEO:
                return ['.mp4', '.webm'];
            case EnumResourceType.AUDIO:
                return ['.mp3', '.wav'];
        }
    }

    public resetImport() {
        this.importedFile = undefined;
    }
}
