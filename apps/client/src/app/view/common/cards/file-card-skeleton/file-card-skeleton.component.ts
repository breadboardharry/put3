import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';

@Component({
    selector: 'app-file-card-skeleton',
    standalone: true,
    imports: [NgClass, FormsModule, HlmSkeletonComponent],
    templateUrl: './file-card-skeleton.component.html',
    styleUrls: ['./file-card-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'w-full h-full select-none' },
})
export class FileCardSkeletonComponent {}
