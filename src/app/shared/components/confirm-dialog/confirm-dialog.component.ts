import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  message: string = '';
  value: string = '';

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { value: string }
  ) {}

  ngOnInit(): void {
    this.translate
      .get(`CONFIRM.VALUES.${this.data.value}`)
      .subscribe((value: string) => {
        this.translate
          .get('CONFIRM.MESSAGE', { value: value })
          .subscribe((msg: string) => (this.message = msg));
      });
  }
}
