import { EnumNavbarItemTitle } from "../enums/dashboard-pages";

export type MenuItem = {
    title: EnumNavbarItemTitle | string;
    icon?: string;
};
