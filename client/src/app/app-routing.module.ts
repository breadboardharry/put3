import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './view/pages/home-page/home-page.component';
import { FoolHomePageComponent } from './view/pages/fool-home-page/fool-home-page.component';
import { MasterDashboardPageComponent } from './view/pages/master-dashboard-page/master-dashboard-page.component';
import { CodelockPageComponent } from './view/pages/codelock-page/codelock-page.component';
import { AccessGuard } from './guards/access.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, data: { animation: 'Home' } },
  { path: 'master', component: MasterDashboardPageComponent, canActivate: [AccessGuard], data: { animation: 'Master' } },
  { path: 'fool', component: FoolHomePageComponent, data: { animation: 'Fool' } },
  { path: 'control', component: CodelockPageComponent, data: { animation: 'Control' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
