import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { EventService } from '../event-service/event.service';
import { ResourceBrowserModal } from 'src/app/view/modals/resource-browser/resource-browser.modal';
import { ResourceSet } from 'src/app/app-models/types/resources';
import {
    EnumResourceDirectory,
    EnumResourceType,
} from 'src/app/app-models/enums/resources';
import { FileData } from 'src/app/app-models/types/file';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';

@Injectable({
    providedIn: 'root',
})
export class ResourcesService {
    private routeUrl = this.backend.apiUrl + '/resources';
    private resources: Partial<ResourceSet> = {};

    constructor(
        private http: HttpClient,
        private backend: BackendService,
        private eventService: EventService,
        private hlmDialogService: HlmDialogService
    ) {
        this.update();
        this.eventService.onResourcesUpdate.subscribe((resources) => {
            this.resources = resources;
        });
    }

    public async update() {
        // const logged = await this.authService.isLogged();
        // if (!logged) return;

        this.getData().then((resources: ResourceSet) => {
            this.resources = resources;
        });
    }

    public typeToDir(type: EnumResourceType): EnumResourceDirectory {
        switch (type) {
            case EnumResourceType.IMAGE:
                return EnumResourceDirectory.IMAGES;
            case EnumResourceType.VIDEO:
                return EnumResourceDirectory.VIDEOS;
            case EnumResourceType.AUDIO:
                return EnumResourceDirectory.AUDIOS;
        }
    }

    public dirToType(dir: EnumResourceDirectory): EnumResourceType {
        switch (dir) {
            case EnumResourceDirectory.IMAGES:
                return EnumResourceType.IMAGE;
            case EnumResourceDirectory.VIDEOS:
                return EnumResourceType.VIDEO;
            case EnumResourceDirectory.AUDIOS:
                return EnumResourceType.AUDIO;
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
     * Get all resources data
     * @returns {Promise<ResourceSet>} Resources
     */
    public getData(): Promise<ResourceSet> {
        return new Promise<ResourceSet>((resolve, reject) => {
            this.http
                .get<ResourceSet>(this.routeUrl, {
                    responseType: 'json',
                    withCredentials: true,
                })
                .subscribe((data: ResourceSet) => {
                    resolve(data);
                });
        });
    }

    /**
     * Get resources data by type
     * @param {EnumResourceType} type Resource type
     * @returns {Promise<FileData[]>} Resources
     */
    public getDataByType(type: EnumResourceType): Promise<FileData[]> {
        const endpoint = this.routeUrl + '/' + this.typeToDir(type);

        return new Promise<FileData[]>((resolve, reject) => {
            this.http
                .get<FileData[]>(endpoint, {
                    responseType: 'json',
                    withCredentials: true,
                })
                .subscribe((data: FileData[]) => {
                    resolve(data);
                });
        });
    }

    public getResources(type?: EnumResourceType): FileData[] {
        // Return resources of a specific type
        if (type) {
            const dir = this.typeToDir(type);
            return this.resources[dir] || [];
        }

        // Return all resources if no type is specified
        return this.flatten();
    }

    public flatten(set: Partial<ResourceSet> = this.resources) {
        let result: any[] = [];

        for (let files of Object.values(set)) {
            result = result.concat(files);
        }

        return result;
    }

    /**
     * Delete multiple resource files
     * @param {string[]} filespath Path of the files to delete
     * @returns {Promise<any>} Server result
     */
    public delete(filespath: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http
                .delete(this.routeUrl, {
                    responseType: 'json',
                    body: filespath,
                    withCredentials: true,
                })
                .subscribe((data: any) => resolve(data));
        });
    }

    public exists(file: FileData | string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let path = typeof file === 'string' ? file : file.href;
            this.http
                .get(this.backend.serverUrl + '/' + path, {
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
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http
                .post(
                    this.routeUrl + '/rename',
                    {
                        currentName,
                        newName,
                        dirpath,
                    },
                    {
                        responseType: 'json',
                        withCredentials: true,
                    }
                )
                .subscribe({
                    next: (data: any) => resolve(data),
                    error: (error: any) => reject(error),
                });
        });
    }

    public addFiles(file: File) {
        let arr: any[] = [];
        let formData = new FormData();

        arr.push(file);
        if (Array.isArray(arr[0])) {
            arr[0].forEach((item: any, i: any) => {
                formData.append('file', arr[0][i]);
            });
        }
        else {
            formData.append('file', arr[0]);
        }

        return this.http
            .post(this.routeUrl + '/upload', formData, {
                reportProgress: true,
                observe: 'events',
                withCredentials: true,
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
    ): Promise<FileData[]> {
        return new Promise((resolve) => {
            const dialogRef = this.hlmDialogService.open(ResourceBrowserModal, {
                context: { type, canImport },
            });

            dialogRef.closed$.subscribe((selection: FileData[]) => {
                console.log('selection', selection);
                resolve(selection);
            });
        });
    }
}
