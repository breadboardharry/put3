import { Media } from "src/app/providers/media";
import { EnumActionType, EnumSessionActionType } from "../enums/action";

export type SessionAction = {
    type: EnumSessionActionType;
};

export type Action = {
    type: EnumActionType;
    data?: ActionData;
};

export type ActionData = {
    track?: Media;
    volume?: number;
    stop?: boolean;
    title?: string;
    message?: string;
    icon?: string;
    image?: string;
    duration?: number;
};