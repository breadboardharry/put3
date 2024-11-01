import { Injectable } from '@angular/core';
import { actions } from 'src/app/data/actions';

@Injectable({
    providedIn: 'root',
})
export class ComponentService {
    constructor() {}

    public resolve(name: string) {
        const action = actions.find((action) => action.component.name === name);
        if (!action) {
            throw new Error(`Action ${name} not found`);
        }
        return action.component.class;
    }
}
