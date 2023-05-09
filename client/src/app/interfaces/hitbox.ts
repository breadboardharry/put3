import { Position } from "./position";
import { Size } from "./size";

export interface Hitbox {
    size: Size;
    position: Position;
    events: any;
    active: boolean;
}
