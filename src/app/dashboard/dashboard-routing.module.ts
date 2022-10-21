import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedGuard } from 'app/core/guards/logged.guard';
import { DashboardComponent } from 'app/dashboard/pages/dashboard.component';

const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    component: DashboardComponent,
    canActivate: [LoggedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
