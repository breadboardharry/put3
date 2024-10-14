import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { APIService } from '../api/api.service';
import { EventService } from '../event-service/event.service';
import { ResourceBrowserModal } from 'src/app/view/modals/resource-browser/resource-browser.modal';
import { ResourceSet } from 'src/app/app-models/types/resources';
import {
    EnumResourceDirectory,
    EnumResourceType,
} from 'src/app/app-models/enums/resources';
import { FileData } from 'src/app/app-models/types/file';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { LocalMedia, RemoteMedia } from 'src/app/providers/media';
import { APIResponse } from '@put3/types';
import path from 'src/app/utilities/path';

@Injectable({
    providedIn: 'root',
})
export class MediaService {
    private routeUrl = '/resources';
    private medias: Partial<ResourceSet<RemoteMedia>> = {};

    public static ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];
    public static ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm'];
    public static ALLOWED_AUDIO_EXTENSIONS = ['mp3', 'wav'];
    public static ALLOWED_EXTENSIONS = [
        ...MediaService.ALLOWED_IMAGE_EXTENSIONS,
        ...MediaService.ALLOWED_VIDEO_EXTENSIONS,
        ...MediaService.ALLOWED_AUDIO_EXTENSIONS,
    ];

    constructor(
        private http: HttpClient,
        private api: APIService,
        private eventService: EventService,
        private hlmDialogService: HlmDialogService
    ) {
        this.update();
        this.eventService.onResourcesUpdate.subscribe((resources) => {
            this.medias = resources;
        });
    }

    public async update(): Promise<typeof this.medias> {
        // const logged = await this.authService.isLogged();
        // if (!logged) return;

        const medias = await this.getAll();
        console.log(medias);
        this.medias = medias;
        return medias;
    }

    /**
     * Get the directory of a resource type
     * @param type Resource type
     * @returns Resource directory
     * @throws Error if the type is invalid
     * @example typeToDir(EnumResourceType.IMAGE) => EnumResourceDirectory.IMAGES
     */
    public typeToDir(type: EnumResourceType): EnumResourceDirectory {
        switch (type) {
            case EnumResourceType.IMAGE:
                return EnumResourceDirectory.IMAGES;
            case EnumResourceType.VIDEO:
                return EnumResourceDirectory.VIDEOS;
            case EnumResourceType.AUDIO:
                return EnumResourceDirectory.AUDIOS;
            default:
                throw new Error('Invalid type');
        }
    }

    /**
     * Get the type of a resource directory
     * @param dir Resource directory
     * @returns Resource type
     * @throws Error if the directory is invalid
     * @example dirToType(EnumResourceDirectory.IMAGES) => EnumResourceType.IMAGE
     */
    public dirToType(dir: EnumResourceDirectory): EnumResourceType {
        switch (dir) {
            case EnumResourceDirectory.IMAGES:
                return EnumResourceType.IMAGE;
            case EnumResourceDirectory.VIDEOS:
                return EnumResourceType.VIDEO;
            case EnumResourceDirectory.AUDIOS:
                return EnumResourceType.AUDIO;
            default:
                throw new Error('Invalid directory');
        }
    }

    /**
     * Get the type of a resource file from its extension
     * @param extension File extension
     * @returns Resource type
     * @throws Error if the extension is invalid
     * @example extensionToType('png') => EnumResourceType.IMAGE
     */
    public static extensionToType(extension: string): EnumResourceType {
        if (MediaService.ALLOWED_IMAGE_EXTENSIONS.includes(extension))
            return EnumResourceType.IMAGE;
        if (MediaService.ALLOWED_VIDEO_EXTENSIONS.includes(extension))
            return EnumResourceType.VIDEO;
        if (MediaService.ALLOWED_AUDIO_EXTENSIONS.includes(extension))
            return EnumResourceType.AUDIO;
        throw new Error(`Invalid extension: ${extension}`);
    }

    /**
     * Get the allowed extensions for a resource type
     * If no type is specified, it will return all allowed extensions
     * @param type Resource type (optional)
     * @returns Allowed extensions
     * @example getAllowedExtensions(EnumResourceType.IMAGE) => ['png', 'jpg', 'jpeg', 'gif']
     * @example getAllowedExtensions() => ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'webm', 'mp3', 'wav']
     */
    public getAllowedExtensions(type?: EnumResourceType): string[] {
        switch (type) {
            case EnumResourceType.IMAGE:
                return MediaService.ALLOWED_IMAGE_EXTENSIONS;
            case EnumResourceType.VIDEO:
                return MediaService.ALLOWED_VIDEO_EXTENSIONS;
            case EnumResourceType.AUDIO:
                return MediaService.ALLOWED_AUDIO_EXTENSIONS;
            default:
                return MediaService.ALLOWED_EXTENSIONS;
        }
    }

    public flattenObject(obj: any, path: string = '') {
        let result: any[] = [];

        for (let key in obj) {
            let newPath = path ? path + '/' + key : key;

            if (Array.isArray(obj[key])) {
                result = result.concat(
                    obj[key].map((item: any) => newPath + '/' + item)
                );
            } else if (typeof obj[key] === 'object') {
                result = result.concat(this.flattenObject(obj[key], newPath));
            }
        }
        return result;
    }

    /**
     * Get all medias
     * @returns Resources
     */
    public getAll(): Promise<ResourceSet<RemoteMedia>> {
        return new Promise((resolve) => {
            this.http
                .get<APIResponse<ResourceSet<FileData>>>(this.routeUrl, {
                    responseType: 'json',
                })
                .subscribe((res) => {
                    const set = {
                        images: res.data.images?.map(
                            (media) =>
                                new RemoteMedia({
                                    name: media.name,
                                    extension: path.extname(media.name),
                                    src: media.href,
                                    size: media.size,
                                })
                        ),
                        videos: res.data.videos?.map(
                            (media) =>
                                new RemoteMedia({
                                    name: media.name,
                                    extension: path.extname(media.name),
                                    src: media.href,
                                    size: media.size,
                                })
                        ),
                        audios: res.data.audios?.map(
                            (media) =>
                                new RemoteMedia({
                                    name: media.name,
                                    extension: path.extname(media.name),
                                    src: media.href,
                                    size: media.size,
                                })
                        ),
                    };
                    resolve(set);
                });
        });
    }

    /**
     * Get resources data by type
     * @param type Resource type
     * @returns Medias
     */
    public getDataByType(type: EnumResourceType): Promise<RemoteMedia[]> {
        const endpoint = this.routeUrl + '/' + this.typeToDir(type);

        return new Promise<RemoteMedia[]>((resolve) => {
            this.http
                .get<APIResponse<FileData[]>>(endpoint, {
                    responseType: 'json',
                })
                .subscribe((res) => {
                    resolve(
                        res.data.map(
                            (media) =>
                                new RemoteMedia({
                                    name: media.name,
                                    extension: media.extension,
                                    src: media.href,
                                    size: media.size,
                                })
                        )
                    );
                });
        });
    }

    public getMedias(type?: EnumResourceType): RemoteMedia[] {
        // Return resources of a specific type
        if (type) {
            const dir = this.typeToDir(type);
            return this.medias[dir] || [];
        }

        // Return all resources if no type is specified
        return this.flatten();
    }

    public flatten<T extends RemoteMedia | LocalMedia>(
        set: Partial<ResourceSet<T>> = this.medias as any
    ): T[] {
        console.log(set);
        let result: T[] = [];

        for (let files of Object.values(set)) {
            result = result.concat(files);
        }

        return result;
    }

    /**
     * Delete multiple resource files
     * @param medias Medias to delete
     * @returns Server result
     */
    public delete(medias: RemoteMedia[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const data = medias.map((media) => {
                type: media.type;
                name: media.name;
            });
            console.log(data);
            this.http
                .delete<APIResponse>(this.routeUrl, {
                    responseType: 'json',
                    body: data,
                })
                .subscribe((res) => resolve(res.data));
        });
    }

    public exists(file: FileData | string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let path = typeof file === 'string' ? file : file.href;
            this.http
                .get(this.api.serverUrl + '/' + path, {
                    responseType: 'blob',
                })
                .subscribe({
                    next: () => resolve(true),
                    error: () => resolve(false),
                });
        });
    }

    /**
     * Rename a resource file
     * @param currentName Current file name
     * @param newName New file name
     * @param dirpath Directory path
     * @returns Server result
     */
    public rename(
        currentName: string,
        newName: string,
        dirpath: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http
                .post<APIResponse>(
                    this.routeUrl + '/rename',
                    {
                        currentName,
                        newName,
                        dirpath,
                    },
                    {
                        responseType: 'json',
                    }
                )
                .subscribe({
                    next: (res) => resolve(res.success),
                    error: (error) => reject(error),
                });
        });
    }

    public upload(file: File[]) {
        let arr: any[] = [];
        let formData = new FormData();

        arr.push(file);
        if (Array.isArray(arr[0])) {
            arr[0].forEach((item: any, i: any) => {
                formData.append('file', arr[0][i]);
            });
        } else {
            formData.append('file', arr[0]);
        }

        return this.http
            .post(this.routeUrl + '/upload', formData, {
                reportProgress: true,
                observe: 'events',
            })
            .pipe(catchError(this.errorMgmt));
    }

    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        // Get client-side error
        if (error.error instanceof ErrorEvent)
            errorMessage = error.error.message;
        // Get server-side error
        else
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        return throwError(errorMessage);
    }

    public browse(
        type?: EnumResourceType,
        canImport: boolean = false
    ): Promise<FileData[] | undefined> {
        return new Promise((resolve) => {
            const dialogRef = this.hlmDialogService.open(ResourceBrowserModal, {
                context: { type, canImport },
            });

            dialogRef.closed$.subscribe((selection: FileData[] | undefined) => {
                resolve(selection);
            });
        });
    }
}
