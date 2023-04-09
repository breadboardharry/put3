import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesktopComponent } from './view/desktop/desktop.component';
import { WindowsButtonComponent } from './view/windows-button/windows-button.component';
import { WindowsMenuComponent } from './view/windows-menu/windows-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HitboxComponent } from './view/hitbox/hitbox.component';
import { MatMenuModule } from '@angular/material/menu';
import { HitboxCoreComponent } from './view/hitbox/core/hitbox-core.component';
import { HitboxSettingsComponent } from './view/hitbox/settings/hitbox-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { DesktopIconComponent } from './view/interaction/desktop-icon/desktop-icon.component';
import { ChildElementsDirective } from './directives/child-elements.directive';
import { RickRollComponent } from './view/interaction/rick-roll/rick-roll.component';
import { AudioPlayerComponent } from './view/interaction/audio-player/audio-player.component';
import { HomePageComponent } from './view/pages/home-page/home-page.component';
import { MasterDashboardPageComponent } from './view/pages/master-dashboard-page/master-dashboard-page.component';
import { FoolHomePageComponent } from './view/pages/fool-home-page/fool-home-page.component';

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
    FoolHomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatMenuModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
