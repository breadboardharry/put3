import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    OnInit,
    Output,
    inject,
    input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { EnumResourceType } from 'src/app/app-models/enums/resources';
import { FileData } from 'src/app/app-models/types/file';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
    selector: 'app-file-card',
    standalone: true,
    imports: [NgClass, FormsModule, HlmSkeletonComponent],
    templateUrl: './file-card.component.html',
    styleUrls: ['./file-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'w-full h-full select-none transition-opacity' },
})
export class FileCardComponent implements OnInit {
    public file = input.required<FileData>();
    public selected = input<boolean>(false);
    public editing = input<boolean>(false);
    public disabled = input<boolean>(false);
    @Output() editedEvent: EventEmitter<string> = new EventEmitter<string>();

    public name: string = '';

    public readonly EnumResourceType = EnumResourceType;

    public readonly backend = inject<BackendService>(BackendService);

    ngOnInit(): void {
        this.name = this.file().name;
    }

    editDone() {
        this.editedEvent.emit(this.name);
    }
}
