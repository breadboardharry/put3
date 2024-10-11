import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PreferencesService } from 'src/app/services/preferences-service/preferences.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ClientService } from 'src/app/services/client-service/client.service';
import { FoolService } from 'src/app/services/fool-service/fool.service';
import { EnumUserRole } from 'src/app/app-models/enums/user';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-fool-home-page',
    templateUrl: './fool-home-page.component.html',
    styleUrls: ['./fool-home-page.component.scss']
})
export class FoolHomePageComponent implements OnInit, OnDestroy {

    public loading: boolean = true;
    private defaultDesktopImage = environment.defaultDesktopImage;

    constructor(
        private clientService: ClientService,
        private backend: BackendService,
        private resourceService: ResourcesService,
        private preferences: PreferencesService,
        public fool: FoolService
    ) {}

    ngOnInit() {
        console.log("[-] FoolHomePageComponent init");
        console.log("[-] ClientService.ROLE", ClientService.ROLE);
        console.log("[-] ClientService", ClientService);
        if (ClientService.ROLE === EnumUserRole.MASTER) return window.location.reload();
        if (ClientService.ROLE === EnumUserRole.FOOL) return this.init();

        this.clientService.roleChanged.subscribe(() => {
            this.init();
        });
        this.clientService.askForRole(EnumUserRole.FOOL, {preferences: this.preferences.get()});
    }

    ngOnDestroy(): void {}

    private init(): void {
        this.loading = false;
        this.fool.sendInfos();
        this.setDesktopImage();
    }

    async setDesktopImage() {
        // Check in cookies if there a previous desktop image is set
        const prevDesktop: any = this.preferences.getDesktop();
        if (!prevDesktop) return;

        // Check if the image still exists
        const exists = await this.resourceService.exists(prevDesktop.image);
        if (!exists) return;

        this.fool.layout.desktop.image = prevDesktop.image;
        return;
    }

    public get sessionCode(): string {
        return ClientService.SESSION_CODE || "";
    }

    public get masterUrl(): string {
        return window.location.origin + '/master?code=' + this.sessionCode;
    }

    public get backgroundImage(): string {
        return this.backend.serverUrl + '/' + (this.fool.layout.desktop.image ? this.fool.layout.desktop.image : this.defaultDesktopImage);
    }

    public copiedCodeToClipboard(): void {
        toast.success("Code copied to clipboard");
    }

    @HostListener('contextmenu', ['$event'])
    private onRightClick(event: any) {
        event.preventDefault();
    }

    private timeout?: NodeJS.Timeout;
    @HostListener('window:resize', ['$event'])
    private onResize(event: any) {
        // Send window size to server
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.fool.sendInfos();
        }, 500);
    }
}
