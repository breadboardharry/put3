import { Injectable, inject } from '@angular/core';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import {
    ConfirmationModal,
    ConfirmationModalInputData,
    ConfirmationModalOutputData,
} from 'src/app/view/modals/confirmation/confirmation.modal';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private hlmDialogService = inject(HlmDialogService);

    public confirm(
        context: ConfirmationModalInputData
    ): Promise<ConfirmationModalOutputData> {
        return new Promise((resolve) => {
            const dialogRef = this.hlmDialogService.open(ConfirmationModal, {
                context,
                closeOnBackdropClick: false,
            });

            dialogRef.closed$.subscribe((result: boolean | undefined) => {
                console.log('Confirmation result:', result);
                resolve(result);
            });
        });
    }
}
