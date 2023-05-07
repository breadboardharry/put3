import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Snackbar } from 'src/app/enums/snackbar';
import { CustomSnackbarComponent } from 'src/app/view/global/custom-snackbar/custom-snackbar.component';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {

    private DEFAULT_DURATION = 3000;

    constructor(private snackbar: MatSnackBar) {}

    public open(type: Snackbar, message: string, duration: number = this.DEFAULT_DURATION) {
        return this.snackbar.openFromComponent(CustomSnackbarComponent, {
            data: {
                message: message,
                type: type
            },
            duration: duration,
            panelClass: type
        });
    }

    public openSuccess(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(Snackbar.Success, message, duration);
    }

    public openError(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(Snackbar.Error, message, duration);
    }

    public openWarning(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(Snackbar.Warning, message, duration);
    }

    public openInfo(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(Snackbar.Info, message, duration);
    }
}
