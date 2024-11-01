import { Component, inject } from '@angular/core';
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
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

export type ConfirmationModalInputData = {
    title: string;
    message: string;
    cancelLabel?: string;
    acceptLabel?: string;
};

export type ConfirmationModalOutputData = boolean | undefined;

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [
        HlmButtonDirective,
        HlmIconComponent,
        HlmDialogHeaderComponent,
        HlmDialogTitleDirective,
        HlmDialogDescriptionDirective,
        HlmDialogContentComponent,
        HlmDialogFooterComponent,
    ],
    providers: [],
    templateUrl: './confirmation.modal.html',
    styleUrls: ['./confirmation.modal.scss'],
    host: { class: 'w-80 flex flex-col gap-4' },
})
export class ConfirmationModal {
    private readonly dialogRef =
        inject<BrnDialogRef<ConfirmationModalOutputData>>(BrnDialogRef);
    private readonly dialogContext =
        injectBrnDialogContext<ConfirmationModalInputData>();

    /**
     * Title of the modal
     */
    protected readonly title = this.dialogContext.title;

    /**
     * Message to display
     */
    protected readonly message = this.dialogContext.message;

    /**
     * Label for the cancel button
     */
    protected readonly cancelLabel = this.dialogContext.cancelLabel ?? 'Cancel';

    /**
     * Label for the accept button
     */
    protected readonly acceptLabel = this.dialogContext.acceptLabel ?? 'Accept';

    /**
     * Accept the confirmation
     */
    public accept(): void {
        this.close(true);
    }

    /**
     * Decline the confirmation
     */
    public decline(): void {
        this.close(false);
    }

    /**
     * Close the modal
     * @param result The result to return
     */
    private close(result: ConfirmationModalOutputData): void {
        this.dialogRef.close(result);
    }
}
