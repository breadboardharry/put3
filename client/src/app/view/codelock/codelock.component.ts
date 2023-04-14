import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-codelock',
  templateUrl: './codelock.component.html',
  styleUrls: ['./codelock.component.scss']
})
export class CodelockComponent implements OnInit {

  @Input() accessCode!: number[];
  @Output() passed: EventEmitter<void> = new EventEmitter<void>();

  code: number[] = [];

  constructor() { }

  ngOnInit(): void { }

  keyPressed(key: number) {
    this.code.push(key);

    // Check if the code is filled
    if (this.code.length >= this.accessCode.length) {
      // Code is correct
      if(this.checkCode(this.code)) {
        this.passed.emit();
        return;
      };

      // Clear the code if not correct
      this.code = [];
    };
  }

  checkCode(code: number[]): boolean {
    return JSON.stringify(code) == JSON.stringify(this.accessCode);
  }

  createArray(size: number): number[] {
    return Array.from({length: size}, (_, i) => i);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Numbers
    if (/^[0-9]$/.test(event.key)) {
      this.keyPressed(parseInt(event.key, 10));
    }
    // Backspace
    if (event.key === 'Backspace') {
      this.code = this.code.slice(0, -1);
    }
  }
}
