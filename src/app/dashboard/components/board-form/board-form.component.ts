import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import {
  BoardAddData,
  DashboardComponent,
} from 'app/dashboard/pages/dashboard.component';

@Component({
  selector: 'app-board-add',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss'],
})
export class BoardFormComponent implements OnInit {
  formTitle: string = 'New board';
  submit: string = 'Create';

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<DashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardAddData
  ) {}

  ngOnInit(): void {
    const origin = this.data.editMode === false ? 'BOARDS' : 'BOARD_CARD';
    this.translate
      .get(`${origin}.FORM.TITLE`)
      .subscribe((title: string) => (this.formTitle = title));
    this.translate
      .get(`${origin}.FORM.SUBMIT`)
      .subscribe((submit: string) => (this.submit = submit));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid)
      this.dialogRef.close({
        title: this.data.title,
        description: this.data.description,
      });
  }
}
