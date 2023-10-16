import { EnumInfoStyle } from "../enums/info";
import { ExclusiveOr } from "./utils";

export type EventMessage = {
    target?: EventTargetData;
    data?: any;
    success?: boolean;
    message?: string;
};

export type EventTargetData = ExclusiveOr<
    { user: string },
    { session: string }
>;

export type EventMessageData = {
    type: EnumInfoStyle;
    text: string;
};