import { Desktop } from "../app-models/types/layout";
import { Hitbox } from "../classes/hitbox";

export type Layout = {
    desktop: Desktop;
    hitboxes: Hitbox[];
};