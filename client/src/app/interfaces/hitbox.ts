import { Action } from "./action";
import { Position } from "./position";
import { Size } from "./size";

export interface Hitbox {
    size: Size;
    position: Position;
    events: { [key: string]: Action };
    active: boolean;
}
