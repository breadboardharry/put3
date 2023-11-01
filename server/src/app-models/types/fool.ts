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
    browser: FoolBrowserInfos;
    window: Window;
    settings: FoolSettings;
};

export type FoolBrowserInfos = {
    name: EnumBrowser,
    permissions: BrowserPermissions;
};

export type BrowserPermissions = {
    audio?: boolean;
    microphone?: boolean;
    camera?: boolean;
    notifications?: boolean;
};

export type FoolSettings = {
    audio?: boolean;
    microphone?: boolean;
    camera?: boolean;
    notifications?: boolean;
};