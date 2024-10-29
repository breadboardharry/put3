import { LocalMedia, RemoteMedia } from 'src/app/providers/media';
import { FileData } from './file';

export type ResourceSet<T extends RemoteMedia | LocalMedia | FileData> = {
    images: T[];
    videos: T[];
    audios: T[];
};
