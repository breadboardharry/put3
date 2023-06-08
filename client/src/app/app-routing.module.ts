import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './view/pages/home-page/home-page.component';
import { FoolHomePageComponent } from './view/pages/fool-home-page/fool-home-page.component';
import { MasterDashboardPageComponent } from './view/pages/master-dashboard-page/master-dashboard-page.component';
import { CodelockPageComponent } from './view/pages/codelock-page/codelock-page.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { Route } from './enums/routes';

const routes: Routes = [
  { path: '', redirectTo: '/' + Route.HOME, pathMatch: 'full' },
  { path: Route.HOME, component: HomePageComponent, data: { animation: 'Home' } },
  { path: Route.MASTER, component: MasterDashboardPageComponent, canActivate: [AuthGuard], data: { animation: 'Master' } },
  { path: Route.FOOL, component: FoolHomePageComponent, data: { animation: 'Fool' } },
  { path: Route.LOGIN, component: CodelockPageComponent, data: { animation: 'Control' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
