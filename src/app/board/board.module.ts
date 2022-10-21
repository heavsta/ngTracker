import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

import { TranslateModule } from '@ngx-translate/core';

import { BoardRoutingModule } from 'app/board/board-routing.module';

import { BoardDialogComponent } from 'app/board/components/board-dialog/board-dialog.component';
import { BoardComponent } from 'app/board/pages/board/board.component';
import { ColumnFormComponent } from 'app/board/components/column-form/column-form.component';
import { ColumnComponent } from 'app/board/components/column/column.component';
import { TaskCardComponent } from 'app/board/components/task-card/task-card.component';
import { TaskComponent } from 'app/board/components/task/task.component';

@NgModule({
  declarations: [
    BoardComponent,
    BoardDialogComponent,
    ColumnComponent,
    ColumnFormComponent,
    TaskCardComponent,
    TaskComponent,
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    DragDropModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    TranslateModule,
  ],
})
export class BoardModule {}
