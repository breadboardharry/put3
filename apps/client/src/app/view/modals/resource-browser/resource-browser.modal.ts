import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import {
    BrnDialogRef,
    injectBrnDialogContext,
} from '@spartan-ng/ui-dialog-brain';
import {
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { toast } from 'ngx-sonner';
import { EnumResourceType } from 'src/app/app-models/enums/resources';
import { FileData } from 'src/app/app-models/types/file';
import { MediaService } from 'src/app/services/resources-service/resources.service';
import { SelectionService } from 'src/app/services/selection-service/selection.service';
import { FileCardComponent } from '../../common/cards/file-card/file-card.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { NgClass } from '@angular/common';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { lucideArrowDownToLine, lucideRotateCcw } from '@ng-icons/lucide';
import { provideIcons } from '@ng-icons/core';
import {
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { LocalMedia, RemoteMedia } from 'src/app/providers/media';

type InputData = {
    type?: EnumResourceType;
    canImport: boolean;
    multiple?: boolean;
};

type OutputData = RemoteMedia[] | undefined;

enum EnumTabs {
    RESOURCES = 'resources',
    IMPORT = 'import',
}

@Component({
    selector: 'app-resource-browser',
    standalone: true,
    imports: [
        HlmTabsComponent,
        HlmTabsListComponent,
        HlmTabsTriggerDirective,
        HlmTabsContentDirective,
        HlmButtonDirective,
        HlmIconComponent,
        HlmDialogHeaderComponent,
        HlmDialogTitleDirective,
        HlmDialogDescriptionDirective,
        HlmDialogContentComponent,
        HlmDialogFooterComponent,
        FileCardComponent,
        NgClass,
    ],
    providers: [provideIcons({ lucideArrowDownToLine, lucideRotateCcw })],
    templateUrl: './resource-browser.modal.html',
    styleUrls: ['./resource-browser.modal.scss'],
    host: { class: 'w-192 h-120 flex flex-col gap-4' },
})
export class ResourceBrowserModal implements OnInit {
    private readonly dialogRef = inject<BrnDialogRef<OutputData>>(BrnDialogRef);
    private readonly dialogContext = injectBrnDialogContext<InputData>();

    /**
     * Type of resource to display
     */
    protected readonly type: EnumResourceType | undefined =
        this.dialogContext.type;
    /**
     * If the user can import a file
     */
    protected readonly canImport: boolean = this.dialogContext.canImport;
    /**
     * If the user can select multiple files
     */
    protected readonly multiple: boolean = this.dialogContext.multiple || false;

    public selectedMenu: EnumTabs = EnumTabs.RESOURCES;
    public importedFile: LocalMedia | undefined;
    public medias: RemoteMedia[] = [];
    public uploading: boolean = false;

    public readonly EnumTabs = EnumTabs;

    constructor(
        public selectionService: SelectionService,
        private resourceService: MediaService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.medias = this.resourceService.getMedias(this.type);
        this.selectionService.init(this.medias, false);
    }

    public tabChanged(tab: string) {
        if (tab == EnumTabs.RESOURCES) {
            this.resetImport();
        } else {
            this.selectionService.clear();
        }
        this.selectedMenu = tab as EnumTabs;
    }

    public select(file: RemoteMedia, event: any, rightClick: boolean = false) {
        this.selectionService.handleSelect(event, file, rightClick);
    }

    public validate(file?: RemoteMedia, event?: any) {
        if (file && event)
            this.selectionService.handleSelect(event, file, false);
        this.close();
    }

    public cancel() {
        this.dialogRef.close(undefined);
    }

    public async close(): Promise<void> {
        if (this.selectedMenu == EnumTabs.RESOURCES) {
            const file = this.selectionService.getSelection()[0];
            this.dialogRef.close([file]);
            return;
        }
        if (!this.importedFile) return;
        const remoteMedia = await this.importedFile.upload();
        this.dialogRef.close([remoteMedia]);
    }

    public get canValidate(): boolean {
        return this.selectedMenu == EnumTabs.RESOURCES
            ? !!this.selectionService.getSelection().length
            : !!this.importedFile;
    }

    public async fileChanged(event: any) {
        const file = event.target.files[0];
        try {
            this.importedFile = await LocalMedia.createFromFile(file);
        } catch (error) {
            toast.error('Error importing file');
            this.importedFile = undefined;
        }
    }

    /**
     * Get the allowed extensions string for file input
     */
    public formatExtensions(): string {
        const extensions = this.resourceService.getAllowedExtensions(this.type);
        return extensions.join(', ');
    }

    public resetImport() {
        this.importedFile = undefined;
    }

    private upload(file: File): Promise<FileData[]> {
        return new Promise((resolve) => {
            this.resourceService
                .upload([file])
                .subscribe((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.Response:
                            console.log('[-] File uploaded successfully!');
                            console.log(event.body.data);
                            resolve(event.body.data);
                    }
                });
        });
    }
}
