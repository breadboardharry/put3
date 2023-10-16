import { EnumUserRole } from "../enums/user";
import { UserPreferences } from "./preferences";

export type RoleRequestData = {
    role: EnumUserRole;
    sessionCode?: string;
    preferences?: UserPreferences;
};

export type RoleResponseData = {
    uuid: string;
    name: string;
    role: EnumUserRole;
    sessionCode?: string;
};