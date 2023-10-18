import { Component, Input, OnInit } from '@angular/core';
import { EnumSessionStatus } from 'put3-models';
import { Session } from 'src/app/classes/session';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { MasterService } from 'src/app/services/master-service/master.service';
import { SessionService } from 'src/app/services/session-service/session.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';

@Component({
    selector: 'app-session-panel',
    templateUrl: './session-panel.component.html',
    styleUrls: ['./session-panel.component.scss']
})
export class SessionPanelComponent implements OnInit, DashboardSection {

    @Input() sessions: Session[] = [];
    @Input() target?: Session;
    @Input() disabled: boolean = false;

    public isAdmin: boolean = false;

    public EnumSessionStatus = EnumSessionStatus;

    constructor(
        private adminService: AdminService,
        private snackbar: SnackbarService,
        private masterService: MasterService,
        private sessionService: SessionService
    ) { }

    ngOnInit(): void {
        this.adminService.isLogged().then((isAdmin) => {
            this.isAdmin = isAdmin;
        });
    }

    public get isSessionRunning(): boolean {
        return this.target?.status === EnumSessionStatus.RUNNING;
    }

    public run(): void {
        if (this.isSessionRunning) return;
        this.snackbar.openSuccess("Session started");
        this.sessionService.run(this.target!.code);
    }

    public shutdown(): void {
        this.masterService.shutdownFool(this.target!.fool);
    }

    public copiedCodeToClipboard(): void {
        if (!this.target || this.disabled) return;
        this.snackbar.openSuccess("Code copied to clipboard");
    }

    public get sessionCode() {
        return this.target?.code;
    }

    public get foolName() {
        return this.target?.fool.name;
    }

    public get foolBrowser() {
        return this.target?.fool.browser;
    }

    public get foolWindow(): string {
        return JSON.stringify(this.target?.fool.window) || '';
    }

    public get foolSettings() {
        return this.target?.fool.settings;
    }

    public get sessionStatus() {
        return this.target?.status;
    }

    public get nbMaster() {
        return this.target?.masters.length;
    }

}
