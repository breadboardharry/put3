import { EnumDashboardPage } from "../enums/dashboard-pages";

export type MenuItem = {
    title: EnumDashboardPage | string;
    icon?: string;
};
