import { Window } from "../types/window";
import { Layout } from "../types/layout";
import { Browser } from "../enums/browser";

export class Fool {

    public id: string;
    public name: string;
    public window: Window;
    public browser: Browser;
    public layout: Layout = {
        desktop: {
            image: undefined
        },
        hitboxes: []
    }

    constructor(fool: {id: string, name: string, desktop: any, infos: any}) {
        console.log(fool);
        this.id = fool.id;
        this.name = fool.name;
        this.window = fool.infos.window;
        this.browser = fool.infos.browser;
        if (fool.desktop) this.layout.desktop = fool.desktop;
    }
}
