import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from 'src/app/services/backend/backend.service';
import { FileData } from 'src/app/types/resources/file-data';

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

    constructor(public backend: BackendService) {}

    ngOnInit(): void {
        this.name = this.file.name;
    }

    editDone() {
        this.editedEvent.emit(this.name);
    }
}
