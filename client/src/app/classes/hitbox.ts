import { Position } from "../app-models/types/position";
import { Size } from "../app-models/types/size";
import { Action } from "../interfaces/action";

export class Hitbox {

    public size: Size;
    public position: Position;
    public events: { [key: string]: Action };
    public active: boolean;

    constructor(hitbox?: {size: Size, position: Position, events: { [key: string]: Action }, active: boolean}) {
        this.size = hitbox?.size || {
            width: 25,
            height: 25
        };
        this.position = hitbox?.position || {
            x: 0,
            y: 0
        };
        this.events = hitbox?.events || {};
        this.active = hitbox?.active || false;
    }

    public run() {
        this.active = true;
    }
}
