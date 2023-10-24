import { EnumResourceType } from "../enums/resources";
import { Window } from "./window";

export type FileData = {
    name: string;
    href: string;
    dirpath: string;
    path: string;
    type: EnumResourceType;
    extension: string;
    size: number;
    dimensions?: Window;
    isBase64?: boolean;
};