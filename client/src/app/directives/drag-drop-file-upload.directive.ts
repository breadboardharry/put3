import { Directive, EventEmitter, Output, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[appDragDropFileUpload]',
})

export class DragDropFileUploadDirective {

    @Output() fileDropped = new EventEmitter<any>();
    @HostBinding('class') private class = '';

    private timeout = 300;
    private timeoutRef: NodeJS.Timeout | undefined;

    constructor() { }

    // Dragover Event
    @HostListener('dragover', ['$event'])
    public dragOver(event: any) {
        clearTimeout(this.timeoutRef);
        event.preventDefault();
        event.stopPropagation();
        this.class = 'hover';
    }

    // Dragleave Event
    @HostListener('dragleave', ['$event'])
    public dragLeave(event: any) {
        this.timeoutRef = setTimeout(() => {
            this.class = '';
        }, this.timeout);

        event.preventDefault();
        event.stopPropagation();
    }

    // Drop Event
    @HostListener('drop', ['$event'])
    public drop(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.class = '';

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}
