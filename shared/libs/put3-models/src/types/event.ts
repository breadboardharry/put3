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