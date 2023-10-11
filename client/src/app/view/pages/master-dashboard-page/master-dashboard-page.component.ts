import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Fool } from 'src/app/classes/fool';
import { ContextMenuAction } from 'src/app/enums/context-menu-action';
import { EnumDashboardPage } from 'src/app/enums/dashboard-pages';
import { EnumUserRole } from 'src/app/enums/role';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ClientService } from 'src/app/services/client-service/client.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { ContextMenu } from 'src/app/types/context-menu';
import { MenuItem } from 'src/app/types/menu-item';

@Component({
    selector: 'app-master-dashboard-page',
    templateUrl: './master-dashboard-page.component.html',
    styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit {

    private sessionCode!: string;
    public loading = true;

    public selectedItem: MenuItem = {
        title: EnumDashboardPage.LAYOUT
    };
    public fools: Fool[] = [];
    public target?: Fool;
    public dashboardPage = EnumDashboardPage;

    public contextMenu: ContextMenu = {
        show: false,
        x: 0,
        y: 0,
        style: {
            position: 'fixed',
            top: '0px',
            left: '0px'
        },
        items: []
    };
    public contextFocus?: Fool;
    public renaming?: Fool;

    constructor(
        private authService: AuthService,
        private clientService: ClientService,
        public resourceService: ResourcesService,
        private eventService: EventService,
        private route: ActivatedRoute,
        private snackbar: SnackbarService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(async params => {
            const isLogged = await this.authService.isLogged();
            console.log("isLogged", isLogged);

            this.sessionCode = params['code'];

            // Ask for role
            this.clientService.roleChanged.subscribe(() => {
                this.init();
                this.loading = false;
            });
            this.clientService.askForRole(EnumUserRole.MASTER, { sessionCode: this.sessionCode });
        });
    }

    private init() {
        this.eventService.onSession.subscribe((session) => {
            // Do something
            console.log("Session message", session);
            this.snackbar.openInfo("Session message");
        });

        this.eventService.onFoolsUpdate.subscribe((fools) => {
            this.updateFools(fools);
        });
    }

    private updateFools(newList: any[]): void {
        this.fools = newList.map((fool: any) => {
            const foolObj = new Fool(fool);
            // Find if a fool with the same id already exists
            let existing = this.fools.find((f) => f.uuid === foolObj.uuid);
            // If it exists, keep its hitboxes
            if (existing) {
                foolObj.layout.hitboxes = existing.layout.hitboxes;
            }
            return foolObj;
        });

        this.updateTarget();
    }

    private updateTarget() {
        // If a target is defined, check if it still exists
        if (this.target && this.fools.length) {
            this.target = this.fools.find((fool) => fool.uuid === this.target!.uuid);
        }
        else this.target = undefined;
    }

    public clickFool(fool: Fool) {
        if (fool == this.renaming) return;
        this.selectTarget(fool);
        this.contextFocus = undefined;
        this.renaming = undefined;
    }

    public rightClickFool(fool: Fool, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.contextFocus = fool;
        this.displayContextMenu(event);
    }

    private displayContextMenu(event: any) {
        this.contextMenu.show = true;

        this.contextMenu.items = [
            {
                title: "Rename",
                action: ContextMenuAction.RENAME
            }
        ];

        this.contextMenu.x = event.clientX;
        this.contextMenu.y = event.clientY;
        this.contextMenu.style.left = event.clientX + 1 + 'px';
        this.contextMenu.style.top = event.clientY + 'px';
    }

    public handleContextMenu(event: any) {
        this.contextMenu.show = false;

        switch (event.item.action) {
            case ContextMenuAction.RENAME:
                this.renaming = this.contextFocus;
                break;
        };

        this.contextFocus = undefined;
    }

    public renameFool(name: string, fool: Fool) {
        this.contextFocus = undefined;
        this.renaming = undefined;
        this.eventService.renameFool(fool, name);
    }

    private selectTarget(fool: Fool) {
        this.target = this.target === fool ? undefined : fool;
    }

    public selectItem(item: MenuItem) {
        this.selectedItem = item;
    }

    @HostListener('document:click')
    documentClick(): void {
        this.contextMenu.show = false;
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: any) {
        this.contextMenu.show = false;
        event.preventDefault();
    }
}
