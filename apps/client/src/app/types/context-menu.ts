import { ContextMenuItem } from "./context-menu-item";

export type ContextMenu = {
    show: boolean;
    x: number;
    y: number;
    style: any;
    items: ContextMenuItem[];
}
