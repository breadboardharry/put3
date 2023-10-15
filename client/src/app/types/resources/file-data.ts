import { EnumResourceType } from "src/app/enums/resources/type";

export type FileData = {
    name: string;
    href: string;
    dirpath: string;
    path: string;
    type: EnumResourceType;
    extension: string;
    size: number;
    dimensions?: {
        width: number;
        height: number;
        ratio: number;
        orientation: 'landscape' | 'portrait';
    }
}
