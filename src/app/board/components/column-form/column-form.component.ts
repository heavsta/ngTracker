import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import {
  BoardComponent,
  ColumnAddData,
} from 'app/board/pages/board/board.component';

@Component({
  selector: 'app-column-form',
  templateUrl: './column-form.component.html',
  styleUrls: ['./column-form.component.scss'],
})
export class ColumnFormComponent implements OnInit {
  formTitle: string = 'New column';
  submit: string = 'Add';

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<BoardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ColumnAddData
  ) {}

  ngOnInit(): void {
    this.translate
      .get('BOARD.FORM.TITLE')
      .subscribe((title: string) => (this.formTitle = title));
    this.translate
      .get('BOARD.FORM.SUBMIT')
      .subscribe((submit: string) => (this.submit = submit));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) this.dialogRef.close(this.data.title);
  }
}
