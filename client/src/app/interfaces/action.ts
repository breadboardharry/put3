import { ComponentLocation } from "../enums/component-location";

export interface Action {
  name: string;
  value: string;
  component: any;
  location: ComponentLocation
}
