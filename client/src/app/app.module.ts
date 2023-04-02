import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackgroundComponent } from './view/background/background.component';
import { WindowsButtonComponent } from './view/windows-button/windows-button.component';
import { WindowsMenuComponent } from './view/windows-menu/windows-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HitboxContainerComponent } from './view/hitbox-container/hitbox-container.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HitboxComponent } from './view/hitbox/hitbox.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    WindowsButtonComponent,
    WindowsMenuComponent,
    HitboxContainerComponent,
    HitboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
