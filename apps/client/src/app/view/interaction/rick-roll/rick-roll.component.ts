import { Component } from '@angular/core';
import { InteractionTemplateComponent } from '../template/interaction-template.component';

@Component({
    selector: 'app-rick-roll',
    templateUrl: './rick-roll.component.html',
})
export class RickRollComponent extends InteractionTemplateComponent {
    protected title = 'Rick Roll';
    protected url = 'https://www.youtube.com/embed/eBGIQ7ZuuiU?autoplay=1';

    constructor() {
        super();
    }

    init() {}

    onHover(hover: boolean): void {}

    onClick(): void {}

    onSingleClick(): void {}

    onDoubleClick(): void {}

    onOutsideClick(): void {}
}
