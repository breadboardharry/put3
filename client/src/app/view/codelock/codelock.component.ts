import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CodeName } from 'src/app/enums/code';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
    selector: 'app-codelock',
    templateUrl: './codelock.component.html',
    styleUrls: ['./codelock.component.scss'],
})
export class CodelockComponent implements OnInit {
    
    @Input() codeName!: CodeName;
    @Output() passed: EventEmitter<void> = new EventEmitter<void>();

    code: number[] = [];
    accessCodeLength: number = 0;

    constructor(private accessControl: AuthService) {}

    ngOnInit(): void {
        this.accessControl.getCodeLength(this.codeName)
            .then((length: number) => {
                this.accessCodeLength = length;
            });
    }

    async keyPressed(key: number) {
        this.code.push(key);

        // Check if the code is filled
        if (this.code.length >= this.accessCodeLength) {
            // Try to login
            const login = await this.accessControl.login(this.code.join(''));

            // If success, emit the passed event
            if (login.success) {
                this.passed.emit();
                return;
            }

            // Clear the code if not correct
            this.code = [];
        }
    }

    createArray(size: number): number[] {
        return Array.from({ length: size }, (_, i) => i);
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
