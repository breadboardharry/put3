import {
    Directive,
    HostListener,
    output,
} from '@angular/core';

@Directive({
    selector: '[file-dropzone]',
    standalone: true,
})
export class FileDropzoneDirective {
    public fileDropped = output<File[]>();

    /**
     * Handle file drop event
     * Source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
     */
    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        event.preventDefault();

        if (!event.dataTransfer) return;
        let files: File[] = [];

        if (event.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            Array.from(event.dataTransfer.items).forEach((item) => {
                // If dropped items aren't files, reject them
                if (item.kind !== 'file') return;
                const file = item.getAsFile();
                if (!file) return;
                files.push(file);
            });
        } else {
            files = Array.from(event.dataTransfer.files);
        }

        if (!files.length) return;
        this.fileDropped.emit(files);
    }

    @HostListener('dragover', ['$event'])
    dragOverHandler(event: any) {
        // Prevent default behavior (Prevent file from being opened)
        event.preventDefault();
    }
}
