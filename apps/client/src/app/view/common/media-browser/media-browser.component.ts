import { Component, HostListener, OnInit, inject, input } from '@angular/core';
import { EnumResourceType } from 'src/app/app-models/enums/resources';
import { FileData } from 'src/app/app-models/types/file';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { FileCardComponent } from '../cards/file-card/file-card.component';
import SelectionHandler from 'src/app/providers/selection';
import { FileDropzoneDirective } from 'src/app/directives/file-dropzone';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { NgClass } from '@angular/common';
import { FileCardSkeletonComponent } from '../cards/file-card-skeleton/file-card-skeleton.component';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
    selector: 'app-media-browser',
    standalone: true,
    imports: [
        FileCardComponent,
        FileCardSkeletonComponent,
        HlmSpinnerComponent,
        NgClass,
    ],
    templateUrl: './media-browser.component.html',
    styleUrl: './media-browser.component.scss',
    host: {
        class: 'relative w-full h-full select-none grid justify-items-center gap-3 overflow-y-auto',
    },
    hostDirectives: [
        {
            directive: FileDropzoneDirective,
            outputs: ['fileDropped'],
        },
    ],
})
export class MediaBrowserComponent implements OnInit {
    // Inputs
    public readonly mediaType = input<EnumResourceType[]>([]);
    public readonly enableSelection = input<boolean>(false);
    public readonly enableImport = input<boolean>(false);

    // Local variables
    public readonly selection = new SelectionHandler<FileData>();
    protected loading = false;
    protected uploadingMedias: (FileData & { originalFile: File })[] = [];

    // Services
    protected readonly mediaService =
        inject<ResourcesService>(ResourcesService);
    protected readonly audioService = inject<AudioService>(AudioService);
    protected readonly backendService = inject<BackendService>(BackendService);

    ngOnInit(): void {}

    /**
     * Handle simple click on a card
     * @param media The media that was clicked
     * @param event The click event
     */
    public onCardClick(media: FileData, event: MouseEvent): void {
        if (!this.enableSelection()) return;

        // Handle toggle selection
        if (event.ctrlKey) {
            this.selection.toggle(media);
            return;
        }

        // Handle range selection
        if (event.shiftKey) {
            // Check if there is a last toggled item
            const lastToggledItem = this.selection.lastToggledItem;
            if (lastToggledItem) {
                // Calculate the range of items to select and select them
                const lastIndex = this.mediaService
                    .getResources()
                    .indexOf(lastToggledItem);
                const currentIndex = this.mediaService
                    .getResources()
                    .indexOf(media);
                const minIndex = Math.min(lastIndex, currentIndex);
                const maxIndex = Math.max(lastIndex, currentIndex);
                this.selection.clear();
                // Re-set the last toggled item to avoid changing reference
                this.selection.lastToggledItem = lastToggledItem;
                // Select the range of items
                for (let i = minIndex; i <= maxIndex; i++) {
                    this.selection.toggle(this.mediaService.getResources()[i], {
                        // Skip registering the last toggled item to avoid changing reference
                        skipLastToggledRegistration: true,
                    });
                }
                return;
            }
        }

        // Handle single selection
        this.selection.selectOnly(media);
    }

    /**
     * Handle double click on a card
     * @param media The media that was clicked
     * @param event The click event
     */
    public onCardDoubleClick(media: FileData, event: MouseEvent): void {
        // Preview
        if (media.type === EnumResourceType.AUDIO) {
            this.audioService.stopAll();
            this.audioService.play(this.backendService.serverUrl + '/' + media.href);
        }
    }

    @HostListener('click', ['$event'])
    onGridClick(event: MouseEvent): void {
        if (event.target !== event.currentTarget) return;
        // Clear selection if the user clicked on the grid
        this.selection.clear();
    }

    /**
     * Handle files dropped on the dropzone
     * (FileDropzoneDirective)
     */
    @HostListener('fileDropped', ['$event'])
    async onFileDropped(files: File[]) {
        if (!this.enableImport()) return;
        await this.importMedias(files);
    }

    /**
     * Import the given files as medias
     */
    private async importMedias(files: File[]): Promise<void> {
        if (!files.length) return;

        // Prevent multiple imports at the same time
        if (this.uploadingMedias.length) {
            toast.error('Please wait for the current import to finish!');
            return;
        }
        this.uploadingMedias = [];

        this.loading = true;
        this.selection.clear();

        let errors = 0;
        for (const file of files) {
            try {
                const mediaObject = await this.mediaService.createMediaObject(
                    file
                );
                this.uploadingMedias.push({
                    ...mediaObject,
                    originalFile: file,
                });
            } catch (error) {
                console.error('Error importing file', file, error);
                errors++;
            }
        }

        if (!this.uploadingMedias.length) {
            toast.error('File(s) type not allowed!');
            this.loading = false;
            return;
        }

        await new Promise((resolve) => {
            this.mediaService
                .addFiles(
                    this.uploadingMedias.map((media) => media.originalFile)
                )
                .subscribe((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.Response:
                            resolve(event.body.data);
                    }
                });
        });

        toast.success(
            `${this.uploadingMedias.length} file(s) uploaded successfully!`
        );
        this.uploadingMedias = [];
        this.loading = false;
    }

    public freeze(): void {
        this.loading = true;
    }

    public run(): void {
        this.loading = false;
    }
}
