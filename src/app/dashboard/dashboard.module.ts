import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

import { TranslateModule } from '@ngx-translate/core';

import { BoardCardComponent } from 'app/dashboard/components/board-card/board-card.component';
import { BoardFormComponent } from 'app/dashboard/components/board-form/board-form.component';
import { DashboardRoutingModule } from 'app/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'app/dashboard/pages/dashboard.component';
import { FilterPipe } from 'app/dashboard/pipes/filter.pipe';

@NgModule({
  declarations: [
    BoardCardComponent,
    BoardFormComponent,
    DashboardComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    TranslateModule,
  ],
})
export class DashboardModule {}
