import { ComponentLocation } from "../enums/component-location";
import { ETrigger } from "../enums/trigger";

export interface Action {
  name: string;
  value: string;
  component: {
    name: string;
    class: any;
  };
  location: ComponentLocation,
  triggers: ETrigger[],
  lockedTriggers?: ETrigger[],
  data?: any;
}
