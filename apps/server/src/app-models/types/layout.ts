import { Action } from "./action";
import { Position } from "./position";
import { Size } from "./size";

export type LayoutData = {
    desktop: Desktop;
    hitboxes: HitboxData[];
};

export type Desktop = {
    image?: string;
};

export type HitboxData = {
    size: Size;
    position: Position;
    events: { [key: string]: Action };
    active: boolean;
};