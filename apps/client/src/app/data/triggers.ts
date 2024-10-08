import { ETrigger } from "../enums/trigger";
import { Trigger } from "../interfaces/trigger";

export const triggers: Trigger[] = [
  {
    name: 'Défaut',
    value: ETrigger.Default,
  },
  {
    name: 'Hover',
    value: ETrigger.Hover,
  },
  {
    name: 'Clique',
    value: ETrigger.Click,
  },
  {
    name: 'Double clique',
    value: ETrigger.DoubleClick
  }
];
