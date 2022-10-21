import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';

import { NotFoundComponent } from 'app/core/pages/not-found/not-found.component';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`NgTracker - ${title}`);
    }
  }
}

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('app/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('app/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('app/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'board',
    loadChildren: () =>
      import('app/board/board.module').then((m) => m.BoardModule),
  },
  {
    path: 'profile/edit',
    loadChildren: () =>
      import('app/profile/profile.module').then((m) => m.ProfileModule),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: TemplatePageTitleStrategy }],
})
export class AppRoutingModule {}
