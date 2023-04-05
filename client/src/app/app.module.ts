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
    ChildElementsDirective
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
