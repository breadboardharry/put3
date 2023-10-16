import { EnumBrowser } from "../enums/browser";
import { Desktop } from "./layout";
import { Window } from "./window";

export type FoolInfos = {
    browser: EnumBrowser;
    window: Window;
};

export type FoolData = {
    uuid: string;
    name: string;
    desktop: Desktop;
    infos: FoolInfos;
};