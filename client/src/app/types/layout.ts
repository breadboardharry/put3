import { Desktop } from "put3-models";
import { Hitbox } from "../classes/hitbox";

export type Layout = {
    desktop: Desktop;
    hitboxes: Hitbox[];
};