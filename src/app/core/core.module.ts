import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'app/shared/shared.module';
import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';
import { HttpErrorInterceptor } from 'app/core/interceptors/http-error.interceptor';
import { LoadingInterceptor } from 'app/core/interceptors/loading.interceptor';
import { FooterComponent } from 'app/core/components/footer/footer.component';
import { HeaderComponent } from 'app/core/components/header/header.component';
import { NotFoundComponent } from 'app/core/pages/not-found/not-found.component';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, NotFoundComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatToolbarModule,
    RouterModule,
    SharedModule,
    TranslateModule,
  ],
  exports: [FooterComponent, HeaderComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
