import { ContextMenuAction } from "../enums/context-menu-action";

export type ContextMenuItem = {
    title: string;
    action: ContextMenuAction;
    disabled?: boolean;
};
