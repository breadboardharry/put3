import { EnumBrowser } from "../enums/browser";
import { Desktop } from "./layout";
import { Window } from "./window";

export type FoolData = {
    uuid: string;
    name: string;
    desktop: Desktop;
    infos: FoolInfos;
};

export type FoolInfos = {
    browser: EnumBrowser;
    window: Window;
    permissions: FoolPermissions;
};

export type FoolPermissions = {
    audio?: boolean;
    notifications?: boolean;
};