import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileData } from 'src/app/types/file-data';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.scss'],
})

export class ImageCardComponent implements OnInit {

    @Input() image!: FileData;
    @Input() selected: boolean = false;
    @Input() editing: boolean = false;
    @Output() editedEvent: EventEmitter<string> = new EventEmitter<string>();

    name: string = '';

    apiUrl = environment.serverUrl + '/' + environment.apiPath;

    constructor() {}

    ngOnInit(): void {
        this.name = this.image.name;
    }

    editDone() {
        this.editedEvent.emit(this.name);
    }
}
