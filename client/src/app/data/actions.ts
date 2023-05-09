import { ComponentLocation } from "../enums/component-location";
import { ETrigger } from "../enums/trigger";
import { Action } from "../interfaces/action";
import { AudioPlayerComponent } from "../view/interaction/audio-player/audio-player.component";
import { DesktopIconComponent } from "../view/interaction/desktop-icon/desktop-icon.component";
import { RickRollComponent } from "../view/interaction/rick-roll/rick-roll.component";

export const actions: Action[] = [
  {
    name: 'Desktop Icon',
    value: 'desktop-icon',
    component: {
        name: 'DesktopIconComponent',
        class: DesktopIconComponent
    },
    location: ComponentLocation.Core,
    triggers: [ETrigger.Default],
    lockedTriggers: [ETrigger.Hover, ETrigger.Click]
  },
  {
    name: 'Rick Roll',
    value: 'rick-roll',
    component: {
        name: 'RickRollComponent',
        class: RickRollComponent
    },
    location: ComponentLocation.Desktop,
    triggers: [ETrigger.Click, ETrigger.DoubleClick]
  },
  {
    name: 'Audio',
    value: 'audio-player',
    component: {
        name: 'AudioPlayerComponent',
        class: AudioPlayerComponent
    },
    location: ComponentLocation.Desktop,
    triggers: [ETrigger.All]
  },
];
