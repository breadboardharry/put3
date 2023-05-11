import { Window } from "../types/window";
import { Layout } from "../types/layout";

export class Fool {

    public id: string;
    public name: string;
    public window: Window;
    public layout: Layout = {
        desktop: {
            image: undefined
        },
        hitboxes: []
    }

    constructor(fool: {id: string, name: string, data: any}) {
        this.id = fool.id;
        this.name = fool.name;
        this.window = fool.data.window;
    }
}
