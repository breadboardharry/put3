import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss']
})
export class CodeInputComponent implements OnInit {

    @ViewChild('codeInput')
    public codeInput !: CodeInputComponent;

    @Input()
    public inputType: string = "number";

    @Input()
    public codeLength: number = 4;

    @Input()
    public disabled: boolean = true;

    @Output()
    public codeChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public codeCompleted: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public enterPressed: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
    }

    public onCodeChanged(code: string) {
        this.codeChanged.emit(code);
    }

    public onCodeCompleted(code: string) {
        this.codeCompleted.emit(code);
    }

    public focusOnField(index: number) {
        this.codeInput.focusOnField(index);
    }

    @HostListener('document:keydown.enter', ['$event'])
    public onEnter(event: KeyboardEvent) {
        this.enterPressed.emit();
    }

}
