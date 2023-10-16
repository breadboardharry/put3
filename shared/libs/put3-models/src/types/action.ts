import { EnumActionType, EnumSessionActionType } from "../enums/action";
import { FileData } from "./file";

export type SessionAction = {
    type: EnumSessionActionType;
};

export type Action = {
    type: EnumActionType;
    data?: ActionData;
};

export type ActionData = {
    track?: FileData;
    volume?: number;
    stop?: boolean;
};