import { Window } from "../types/window";
import { Layout } from "../types/layout";
import { EnumBrowser } from "../enums/browser";

export type FoolData = {
    uuid: string;
    name: string;
    desktop: any;
    infos: any;
}

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

    constructor(fool: FoolData) {
        this.uuid = fool.uuid;
        this.name = fool.name;
        this.window = fool.infos.window;
        this.browser = fool.infos.browser;
        if (fool.desktop) this.layout.desktop = fool.desktop;
    }

    public update(fool: FoolData | Fool) {
        if (fool instanceof Fool) {
            this.name = fool.name;
            this.window = fool.window;
            this.browser = fool.browser;
            if (fool.layout.desktop) this.layout.desktop = fool.layout.desktop;
            return;
        }
        this.name = fool.name;
        this.window = fool.infos.window;
        this.browser = fool.infos.browser;
        if (fool.desktop) this.layout.desktop = fool.desktop;
    }

}
