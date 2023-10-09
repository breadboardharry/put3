import { FileData } from "./resources/file-data";

export type Action = {
    type: string;

    track?: FileData;
    volume?: number;
    stop?: boolean;
};