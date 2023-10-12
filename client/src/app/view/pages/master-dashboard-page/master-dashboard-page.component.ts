import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Fool } from 'src/app/classes/fool';
import { ContextMenuAction } from 'src/app/enums/context-menu-action';
import { EnumDashboardPage } from 'src/app/enums/dashboard-pages';
import { EnumUserRole } from 'src/app/enums/role';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { ClientService } from 'src/app/services/client-service/client.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { SessionService } from 'src/app/services/session-service/session.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { ContextMenu } from 'src/app/types/context-menu';
import { MenuItem } from 'src/app/types/menu-item';

export type Session = {
    code: string;
    masters: string[];
    fool: Fool;
    status: string;
};

@Component({
    selector: 'app-master-dashboard-page',
    templateUrl: './master-dashboard-page.component.html',
    styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit {

    private sessionCode!: string;
    public loading: boolean = true;
    public isAdmin: boolean = false;
    public sessionClosed: boolean = false;

    public selectedItem: MenuItem = {
        title: EnumDashboardPage.LAYOUT
    };
    public sessions: Session[] = [];
    public target?: Session;
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
    public contextFocus?: Session;
    public renaming?: Session;

    constructor(
        private adminService: AdminService,
        private clientService: ClientService,
        public resourceService: ResourcesService,
        private eventService: EventService,
        private route: ActivatedRoute,
        private snackbar: SnackbarService,
        private sessionService: SessionService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(async params => {
            this.isAdmin = await this.adminService.isLogged();
            this.sessionCode = params['code'];

            this.clientService.roleChanged.subscribe(() => {
                this.init();
                this.loading = false;
            });
            // If the user is logged as admin, the code is not needed (undefined)
            this.clientService.askForRole(EnumUserRole.MASTER, { sessionCode: this.sessionCode });
        });
    }

    private init() {
        if (this.isAdmin) {
            this.sessionService.getAll().then((sessions) => {
                sessions.forEach((session) => {
                    this.sessionRecieved(session);
                });
            });
        }
        this.eventService.onSession.subscribe((session) => {
            console.log("Session message", session);
            this.sessionRecieved(session);
        });
    }

    private sessionRecieved(session: any): void {
        session.fool = new Fool(session.fool);

        if (this.isAdmin) {
            const existingSession = this.sessions.find((s) => s.code === session.code);
            if (existingSession) {
                if (session.status === "closed") {
                    this.sessions.splice(this.sessions.indexOf(existingSession), 1);
                    this.updateTarget();
                    return;
                }
                existingSession.masters = session.masters;
                session.fool.layout.hitboxes = existingSession.fool.layout.hitboxes;
                existingSession.fool = session.fool;
                this.updateTarget();
            }
            else {
                this.sessions.push(session);
            }
            return;
        }

        // First time
        if (!this.sessions.length) {
            this.sessions = [session];
            this.target = session;
            return;
        }
        // When session updated
        if (session.status === "closed") {
            this.sessionClosed = true;
            this.snackbar.openError("Session closed");
            setTimeout(() => {
                this.adminService.logout();
            }, 3000);
            return;
        }
        const existingSession = this.sessions[0];
        session.fool.layout.hitboxes = existingSession.fool.layout.hitboxes;
        existingSession.fool = session.fool;
        existingSession.masters = session.masters;
        this.updateTarget();
    }

    private updateTarget() {
        // If a target is defined, check if it still exists
        if (this.target && this.sessions.length) {
            this.target = this.sessions.find((session) => session.code === this.target!.code);
        }
        else this.target = undefined;
    }

    public clickSession(session: Session) {
        if (session == this.renaming) return;
        this.selectTarget(session);
        this.contextFocus = undefined;
        this.renaming = undefined;
    }

    public rightClickSession(session: Session, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.contextFocus = session;
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

    private selectTarget(session: Session) {
        this.target = (this.target === session) ? undefined : session;
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
