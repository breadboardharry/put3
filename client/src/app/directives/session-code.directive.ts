import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[sessionCodeInput]',
})
export class SessionCodeDirective {

    @HostListener('input', ['$event'])
    onInputChange(event: Event) {
        const inputElement = <HTMLInputElement>event.target;
        inputElement.value = inputElement.value.replace(/[^0-9]/g, '').substring(0, 5);
    }

}
