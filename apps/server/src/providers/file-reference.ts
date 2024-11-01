import path from 'path';
import { EnumResourceType } from '../app-models/enums/resources';

export class FileRef {
    public filename: string;
    public extension: string;
    public absolutePath: string;
    public type: EnumResourceType;

    constructor(absolutePath: string, type: EnumResourceType) {
        this.absolutePath = path.normalize(absolutePath);
        this.filename = path.basename(this.absolutePath);
        this.extension = path.extname(this.filename).slice(1);
        this.type = type;
    }
}
