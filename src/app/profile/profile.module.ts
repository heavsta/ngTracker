import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from '@ngx-translate/core';

import { LoggedGuard } from 'app/core/guards/logged.guard';
import { ProfileComponent } from 'app/profile/pages/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        title: 'Profile',
        component: ProfileComponent,
        canActivate: [LoggedGuard],
      },
    ]),
    TranslateModule,
  ],
})
export class ProfileModule {}
