import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    HostListener,
    OnInit,
    inject,
    input,
} from '@angular/core';
import { EnumResourceType } from 'src/app/app-models/enums/resources';
import { FileData } from 'src/app/app-models/types/file';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { FileCardComponent } from '../cards/file-card/file-card.component';
import SelectionHandler from 'src/app/providers/selection';

@Component({
    selector: 'app-media-browser',
    standalone: true,
    imports: [FileCardComponent],
    templateUrl: './media-browser.component.html',
    styleUrl: './media-browser.component.scss',
    host: {
        class: 'w-full h-full select-none grid justify-items-center gap-3 overflow-y-auto',
    },
})
export class MediaBrowserComponent implements OnInit {
    // Inputs
    public readonly mediaType = input<EnumResourceType[]>([]);
    public readonly enableSelection = input<boolean>(false);

    // Local variables
    public readonly selection = new SelectionHandler<FileData>();

    // Services
    protected readonly mediaService = inject<ResourcesService>(ResourcesService);

    ngOnInit(): void {
    }

    /**
     * Handle simple click on a card
     * @param media The media that was clicked
     * @param event The click event
     */
    public onCardClick(media: FileData, event: MouseEvent): void {
        if (!this.enableSelection) return;

        // Hadle multiple selection
        if (event.ctrlKey) {
            this.selection.toggle(media);
            return;
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
        // TODO
    }

    @HostListener('click', ['$event'])
    onGridClick(event: MouseEvent): void {
        if (event.target !== event.currentTarget) return;
        // Clear selection if the user clicked on the grid
        this.selection.clear();
    }
}
