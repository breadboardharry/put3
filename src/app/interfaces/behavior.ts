import { Action } from "./action";
import { Trigger } from "./trigger";

export interface Behavior {
  action: Action | undefined;
  trigger: Trigger | undefined;
}
