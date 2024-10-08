import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnumInfoStyle } from 'src/app/app-models/enums/info';
import { CustomSnackbarComponent } from 'src/app/view/common/custom-snackbar/custom-snackbar.component';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {

    private DEFAULT_DURATION = 3000;

    constructor(private snackbar: MatSnackBar) {}

    public open(type: EnumInfoStyle, message: string, duration: number = this.DEFAULT_DURATION) {
        return this.snackbar.openFromComponent(CustomSnackbarComponent, {
            data: {
                message: message,
                type: type
            },
            duration: duration,
            panelClass: 'snackbar-' + type
        });
    }

    public openSuccess(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(EnumInfoStyle.SUCCESS, message, duration);
    }

    public openError(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(EnumInfoStyle.ERROR, message, duration);
    }

    public openWarning(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(EnumInfoStyle.WARNING, message, duration);
    }

    public openInfo(message: string, duration: number = this.DEFAULT_DURATION) {
        return this.open(EnumInfoStyle.INFO, message, duration);
    }
}
