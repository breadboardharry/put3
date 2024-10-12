import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesktopComponent } from './view/fool/desktop/desktop.component';
import { WindowsButtonComponent } from './view/fool/windows-button/windows-button.component';
import { WindowsMenuComponent } from './view/fool/windows-menu/windows-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HitboxComponent } from './view/hitbox/hitbox.component';
import { HitboxCoreComponent } from './view/hitbox/core/hitbox-core.component';
import { HitboxSettingsComponent } from './view/hitbox/settings/hitbox-settings.component';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { DesktopIconComponent } from './view/interaction/desktop-icon/desktop-icon.component';
import { ChildElementsDirective } from './directives/child-elements.directive';
import { RickRollComponent } from './view/interaction/rick-roll/rick-roll.component';
import { AudioPlayerComponent } from './view/interaction/audio-player/audio-player.component';
import { HomePageComponent } from './view/pages/home-page/home-page.component';
import { MasterDashboardPageComponent } from './view/pages/master-dashboard-page/master-dashboard-page.component';
import { FoolHomePageComponent } from './view/pages/fool-home-page/fool-home-page.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { DashboardNavbarComponent } from './view/master/navbar/dashboard-navbar.component';
import { FoolCardComponent } from './view/common/cards/fool-card/fool-card.component';
import { SoundboardComponent } from './view/master/soundboard/soundboard.component';
import { SoundboardButtonComponent } from './view/master/soundboard/soundboard-button/soundboard-button.component';
import { CodelockComponent } from './view/codelock/codelock.component';
import { CodelockPageComponent } from './view/pages/codelock-page/codelock-page.component';
import { AssetsGalleryComponent } from './view/master/assets-gallery/assets-gallery.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { ContextMenuComponent } from './view/common/context-menu/context-menu.component';
import { LayoutEditorComponent } from './view/master/layout-editor/layout-editor.component';
import { ButtonRaisedComponent } from './view/common/buttons/button-raised/button-raised.component';
import { GradientLoaderComponent } from './view/common/loaders/gradient-loader/gradient-loader.component';
import { SessionEnterPageComponent } from './view/pages/session-enter-page/session-enter-page.component';
import { SessionCodeDirective } from './directives/session-code.directive';
import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CodeInputModule } from 'angular-code-input';
import { CodeInputComponent } from './view/common/code-input/code-input.component';
import { SessionPanelComponent } from './view/master/session-panel/session-panel.component';
import { LandingPageToolbarComponent } from './view/fool/landing-page-toolbar/landing-page-toolbar.component';
import { NotificationBoardComponent } from './view/master/notification-board/notification-board.component';
import { ButtonSmallComponent } from './view/common/buttons/button-small/button-small.component';
import { ClientService } from './services/client-service/client.service';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmIconModule } from '@spartan-ng/ui-icon-helm';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmSonnerModule } from '@spartan-ng/ui-sonner-helm';
import { HlmSpinnerModule } from '@spartan-ng/ui-spinner-helm';
import { HlmDialogModule } from '@spartan-ng/ui-dialog-helm';
import { HlmTooltipModule } from '@spartan-ng/ui-tooltip-helm';
import { HlmTabsModule } from '@spartan-ng/ui-tabs-helm';
import { BrnContextMenuModule } from '@spartan-ng/ui-menu-brain';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { NgIconsModule } from '@ng-icons/core';
import { lucideArrowDownToLine } from '@ng-icons/lucide';
import { MediaBrowserComponent } from './view/common/media-browser/media-browser.component';
import { MediaInfoboxComponent } from './view/common/media-infobox/media-infobox.component';

@NgModule({
    declarations: [
        AppComponent,
        DesktopComponent,
        WindowsButtonComponent,
        WindowsMenuComponent,
        HitboxComponent,
        HitboxCoreComponent,
        HitboxSettingsComponent,
        DesktopIconComponent,
        ChildElementsDirective,
        RickRollComponent,
        AudioPlayerComponent,
        HomePageComponent,
        MasterDashboardPageComponent,
        FoolHomePageComponent,
        DashboardNavbarComponent,
        FoolCardComponent,
        SoundboardComponent,
        SoundboardButtonComponent,
        CodelockComponent,
        CodelockPageComponent,
        AssetsGalleryComponent,
        DragDropFileUploadDirective,
        ContextMenuComponent,
        LayoutEditorComponent,
        ButtonRaisedComponent,
        GradientLoaderComponent,
        SessionEnterPageComponent,
        SessionCodeDirective,
        CodeInputComponent,
        SessionPanelComponent,
        LandingPageToolbarComponent,
        NotificationBoardComponent,
        ButtonSmallComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        MediaBrowserComponent,
        MediaInfoboxComponent,
        HlmButtonModule,
        HlmIconModule,
        HlmMenuModule,
        HlmSonnerModule,
        HlmSpinnerModule,
        HlmDialogModule,
        HlmTooltipModule,
        HlmTabsModule,
        BrnTooltipContentDirective,
        BrnContextMenuModule,
        BrnDialogContentDirective,
        BrnDialogTriggerDirective,
        CodeInputModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DragDropModule,
        MatSliderModule,
        FormsModule,
        ReactiveFormsModule,
        QRCodeModule,
        ClipboardModule,
        NgIconsModule.withIcons({ lucideArrowDownToLine }),
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initApp,
            deps: [ClientService],
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class AppModule {}

function initApp(clientService: ClientService): () => Promise<any> {
    return () => clientService.init();
}
