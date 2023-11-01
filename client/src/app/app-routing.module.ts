import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './view/pages/home-page/home-page.component';
import { FoolHomePageComponent } from './view/pages/fool-home-page/fool-home-page.component';
import { MasterDashboardPageComponent } from './view/pages/master-dashboard-page/master-dashboard-page.component';
import { CodelockPageComponent } from './view/pages/codelock-page/codelock-page.component';
import { EnumAppRoute } from './enums/routes';
import { MasterValidSessionGuard } from './guards/master-valid-session/master-valid-session.guard';
import { SessionEnterPageComponent } from './view/pages/session-enter-page/session-enter-page.component';

const routes: Routes = [
    { path: '', redirectTo: EnumAppRoute.HOME, pathMatch: 'full' },
    { path: EnumAppRoute.HOME, component: HomePageComponent, data: { animation: 'Home' } },
    { path: EnumAppRoute.FOOL, component: FoolHomePageComponent, data: { animation: 'Fool' } },
    { path: EnumAppRoute.MASTER, children: [
        { path: '', component: MasterDashboardPageComponent, canActivate: [MasterValidSessionGuard], data: { animation: 'Master' }},
        { path: 'session', component: SessionEnterPageComponent, data: { animation: 'Control' }},
        { path: '**', redirectTo: '/' + EnumAppRoute.MASTER, pathMatch: 'full'},
    ]},
    { path: EnumAppRoute.LOGIN, component: CodelockPageComponent, data: { animation: 'Control' } },
    { path: '**', redirectTo: EnumAppRoute.HOME, pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
