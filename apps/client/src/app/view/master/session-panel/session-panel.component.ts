import { Component, Input, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { EnumSessionStatus } from 'src/app/app-models/enums/session';
import { Session } from 'src/app/classes/session';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';
import { ClientService } from 'src/app/services/client-service/client.service';
import { MasterService } from 'src/app/services/master-service/master.service';
import { SessionService } from 'src/app/services/session-service/session.service';

@Component({
    selector: 'app-session-panel',
    templateUrl: './session-panel.component.html',
    styleUrls: ['./session-panel.component.scss']
})
export class SessionPanelComponent implements OnInit, DashboardSection {

    @Input() sessions: Session[] = [];
    @Input() target?: Session;
    @Input() disabled: boolean = false;

    public EnumSessionStatus = EnumSessionStatus;
    public ClientService = ClientService;

    constructor(
        private masterService: MasterService,
        private sessionService: SessionService
    ) { }

    ngOnInit(): void {
    }

    public get isSessionRunning(): boolean {
        return this.target?.status === EnumSessionStatus.RUNNING;
    }

    public run(): void {
        if (this.isSessionRunning) return;
        toast.success("Session started");
        this.sessionService.run(this.target!.code);
    }

    public shutdown(): void {
        this.masterService.shutdownFool(this.target!.fool);
    }

    public copiedCodeToClipboard(): void {
        if (!this.target || this.disabled) return;
        toast.success("Code copied to clipboard");
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
