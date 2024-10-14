import { Injector } from '@angular/core';
import { EnumResourceType } from '../app-models/enums/resources';
import { MediaService } from '../services/resources-service/resources.service';
import path from '../utilities/path';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileData } from '../app-models/types/file';

class MediaFactory {
    /**
     * Injector instance
     * It will be used to inject the services into the media instances
     */
    public static injector: Injector;
}

class Media {
    /**
     * Name of the media
     * This is the unique identifier of the media
     * @example "my_image.png", "my_video.mp4", "my_audio.mp3"
     */
    public name: string;

    /**
     * File extension
     * @example "png", "mp4", "mp3"
     */
    public extension: string;

    /**
     * Name of the media without the extension
     * @example "my_image", "my_video", "my_audio"
     */
    public rootName: string;

    /**
     * Media type
     * It can be an image, a video or an audio
     */
    public type: EnumResourceType;

    /**
     * Size of the media in bytes
     */
    public size: number;

    /**
     * Path or URL to the media
     */
    public src: string;

    /**
     * Resources service instance
     */
    public resourcesService: MediaService;

    constructor(params: {
        name: string;
        extension: string;
        src: string;
        size: number;
    }) {
        this.name = params.name;
        this.type = MediaService.extensionToType(params.extension);
        this.rootName = path.basename(params.name, `.${params.extension}`);
        this.src = params.src;
        this.extension = params.extension;
        this.size = params.size;
        this.resourcesService = MediaFactory.injector.get(MediaService);
    }
}

class LocalMedia extends Media {
    /**
     * File object
     */
    public sourceFile: File;

    constructor(params: {
        name: string;
        extension: string;
        src: string;
        size: number;
        sourceFile: File;
    }) {
        super(params);
        this.sourceFile = params.sourceFile;
    }

    public async upload(): Promise<RemoteMedia> {
        const response: FileData[] = await new Promise((resolve, reject) => {
            this.resourcesService
                .upload([this.sourceFile])
                .subscribe((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.Response:
                            resolve(event.body.data);
                    }
                });
        });

        return new RemoteMedia({
            name: response[0].name,
            extension: response[0].extension,
            src: response[0].href,
            size: response[0].size,
        });
    }

    /**
     * Create a LocalMedia object from a File object
     * @param file File object
     * @returns Promise that resolves with a LocalMedia object
     */
    public static createFromFile(file: File): Promise<LocalMedia> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const media = new LocalMedia({
                        name: file.name,
                        extension: path.extname(file.name),
                        src: reader.result as string,
                        size: file.size,
                        sourceFile: file,
                    });
                    resolve(media);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * Upload multiple LocalMedia objects
     */
    public static uploadMultiple(
        localMedias: LocalMedia[]
    ): Promise<RemoteMedia[]> {
        return new Promise(async (resolve, reject) => {
            const response: FileData[] = await new Promise(
                (resolve, reject) => {
                    MediaFactory.injector
                        .get(MediaService)
                        .upload(localMedias.map((media) => media.sourceFile))
                        .subscribe((event: HttpEvent<any>) => {
                            switch (event.type) {
                                case HttpEventType.Response:
                                    resolve(event.body.data);
                            }
                        });
                }
            );

            const remoteMedias = response.map((result) => {
                return new RemoteMedia({
                    name: result.name,
                    extension: path.extname(result.name),
                    src: result.href,
                    size: result.size,
                });
            });
            resolve(remoteMedias);
        });
    }
}

class RemoteMedia extends Media {
    constructor(params: {
        name: string;
        extension: string;
        src: string;
        size: number;
    }) {
        super(params);
    }
}

export { MediaFactory, Media, LocalMedia, RemoteMedia };
