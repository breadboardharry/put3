import { Component, inject, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideX } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { toast } from 'ngx-sonner';
import { FileData } from 'src/app/app-models/types/file';
import SelectionHandler from 'src/app/providers/selection';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';

@Component({
    selector: 'app-media-infobox',
    standalone: true,
    imports: [HlmButtonDirective, HlmIconComponent],
    providers: [provideIcons({ lucideX, lucideTrash2 })],
    templateUrl: './media-infobox.component.html',
    styleUrl: './media-infobox.component.scss',
    host: { class: 'w-full h-16 flex items-center bg-secondary' },
})
export class MediaInfoboxComponent {
    // Inputs
    public readonly selection = input.required<SelectionHandler<FileData>>();

    // Outputs
    public readonly onClose = output<void>();
    public readonly onDelete = output<void>();
    public readonly onDeleted = output<void>();

    // Services
    private readonly modalService = inject(ModalService);
    private readonly mediaService = inject(ResourcesService);

    public triggerClose() {
        this.selection().clear();
        this.onClose.emit();
    }

    public async triggerDelete(): Promise<void> {
        const selectionSize = this.selection().size;
        const result = await this.modalService.confirm({
            title: `Are you sure?`,
            message: `You are about to delete ${selectionSize} file(s)`,
            acceptLabel: 'Delete',
        });
        if (!result) return;
        this.onDelete.emit();
        await this.mediaService.delete(this.selection().getItems());
        this.selection().clear();
        this.onDeleted.emit();
        toast.success(`${selectionSize} file(s) deleted`);
    }
}
