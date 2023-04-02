import { Behavior } from "./behavior";
import { Size } from "./size";

export interface Hitbox {
  size: Size;
  behavior: Behavior;
  active: boolean;
}
