import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileData } from 'src/app/types/resources/file-data';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-file-card',
    templateUrl: './file-card.component.html',
    styleUrls: ['./file-card.component.scss'],
})

export class FileCardComponent implements OnInit {

    @Input() file!: FileData;
    @Input() selected: boolean = false;
    @Input() editing: boolean = false;
    @Output() editedEvent: EventEmitter<string> = new EventEmitter<string>();

    name: string = '';

    apiUrl = environment.serverUrl + '/' + environment.apiPath;

    constructor() {}

    ngOnInit(): void {
        this.name = this.file.name;
    }

    editDone() {
        this.editedEvent.emit(this.name);
    }
}
