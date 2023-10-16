import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fool } from 'src/app/classes/fool';
import { Session } from 'src/app/classes/session';
import { ContextMenuAction } from 'src/app/enums/context-menu-action';
import { EnumNavbarItemTitle } from 'src/app/enums/dashboard-pages';
import { EnumAppRoute } from 'src/app/enums/routes';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { ClientService } from 'src/app/services/client-service/client.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { SessionService } from 'src/app/services/session-service/session.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { TypeService } from 'src/app/services/utils/type/type.service';
import { ContextMenu } from 'src/app/types/context-menu';
import { EnumSessionActionType, EnumSessionStatus, EnumUserRole } from 'put3-models';

@Component({
    selector: 'app-master-dashboard-page',
    templateUrl: './master-dashboard-page.component.html',
    styleUrls: ['./master-dashboard-page.component.scss']
})
export class MasterDashboardPageComponent implements OnInit, OnDestroy {

    private sessionCode!: string;
    public loading: boolean = true;
    public isAdmin: boolean = false;
    public sessionClosed: boolean = false;

    public sessions: Session[] = [];
    public target?: Session;
    public EnumPage = EnumNavbarItemTitle;
    public section: EnumNavbarItemTitle = EnumNavbarItemTitle.LAYOUT;

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
        private sessionService: SessionService,
        private router: Router
    ) {}

    private subscriptions: { [key: string]: any } = {};

    async ngOnInit() {
        // Subscribe to fragment changes (anchor in the URL)
        this.subscriptions['fragment'] = this.route.fragment.subscribe(fragment  => {
            if (!fragment) return;
            if (!TypeService.isPartOfEnum(fragment, EnumNavbarItemTitle)) {
                this.router.navigate([EnumAppRoute.MASTER]);
                return;
            }
            this.section = fragment;
        });

        this.isAdmin = await this.adminService.isLogged();
        // No code required for admin
        if (!this.isAdmin) {
            this.sessionCode = this.sessionService.getFromCookies();
            if (!this.sessionCode) {
                this.router.navigate([EnumAppRoute.MASTER]);
                return;
            }
        }

        // If a role is already defined
        if (ClientService.ROLE === EnumUserRole.FOOL) return window.location.reload();
        if (ClientService.ROLE === EnumUserRole.MASTER) return this.init();

        // Otherwise, ask for a role and wait for the response
        this.subscriptions['roleChanged'] = this.clientService.roleChanged.subscribe(() => {
            return this.init();
        });
        // If the user is logged as admin, the code is not needed (undefined)
        this.clientService.askForRole(EnumUserRole.MASTER, { sessionCode: this.sessionCode });
    }

    ngOnDestroy(): void {
        Object.keys(this.subscriptions).forEach((key) => {
            this.subscriptions[key].unsubscribe();
        });
    }

    private init() {
        this.loading = false;
        if (this.isAdmin) {
            this.sessionService.getAll().then((sessions) => {
                sessions.forEach((session) => {
                    this.sessionRecieved(session);
                });
            });
        }
        this.subscriptions['onSession'] = this.eventService.onSession.subscribe((session) => {
            console.log("[*] Session message", session);
            this.sessionRecieved(session);
        });
    }

    private sessionRecieved(session: Session): void {
        if (this.isAdmin) {
            const existingSession = this.sessions.find((s) => s.code === session.code);
            if (existingSession) {
                if (session.status === EnumSessionStatus.CLOSED) {
                    this.sessions.splice(this.sessions.indexOf(existingSession), 1);
                    this.updateTarget();
                    return;
                }
                existingSession.update(session);
                this.updateTarget();
            }
            else this.sessions.push(session);
            return;
        }

        // First time
        if (!this.sessions.length) {
            this.sessions = [session];
            this.target = session;
            return;
        }
        // When session updated
        if (session.status === EnumSessionStatus.CLOSED) this.exit();
        const existingSession = this.sessions[0];
        existingSession.update(session);
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

    public get displayFoolList(): boolean {
        return this.isAdmin && this.section != EnumNavbarItemTitle.RESOURCES;
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

    private exit() {
        this.sessionClosed = true;
        this.snackbar.openError("Session closed");
        setTimeout(() => {
            this.adminService.logout();
        }, 3000);
    }
}
