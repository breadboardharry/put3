import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'custom-snackbar',
    templateUrl: './custom-snackbar.component.html',
    styleUrls: ['./custom-snackbar.component.scss'],
})
export class CustomSnackbarComponent implements OnInit {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

    ngOnInit(): void {}
}
