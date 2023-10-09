import { Window } from "../types/window";
import { Layout } from "../types/layout";
import { EnumBrowser } from "../enums/browser";

export class Fool {

    public uuid: string;
    public name: string;
    public window: Window;
    public browser: EnumBrowser;
    public layout: Layout = {
        desktop: {
            image: undefined
        },
        hitboxes: []
    }

    constructor(fool: {uuid: string, name: string, desktop: any, infos: any}) {
        this.uuid = fool.uuid;
        this.name = fool.name;
        this.window = fool.infos.window;
        this.browser = fool.infos.browser;
        if (fool.desktop) this.layout.desktop = fool.desktop;
    }
}
