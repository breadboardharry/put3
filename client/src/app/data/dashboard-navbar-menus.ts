import { EnumDashboardPage } from '../enums/dashboard-pages';
import { Menu } from '../types/menu';

export const dashboardNavbarMenus: Menu[] = [
    [
        {
            title: EnumDashboardPage.LAYOUT,
            icon: 'edit-image.png',
        },
        {
            title: EnumDashboardPage.SOUNDBOARD,
            icon: 'speaker.png',
        },
        {
            title: EnumDashboardPage.RESOURCES,
            icon: 'photo-gallery.png',
        },
    ],
    [
        {
            title: EnumDashboardPage.SETTINGS,
            icon: 'gear.png',
        },
        {
            title: 'Logout',
            icon: 'logout.png',
        },
    ],
];
