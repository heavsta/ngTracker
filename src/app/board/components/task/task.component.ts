import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import { FileService } from 'app/core/services/file.service';
import { NotifierService } from 'app/core/services/notifier.service';
import { User } from 'app/shared/models/user.model';
import { ColumnComponent, TaskAddData } from '../column/column.component';

interface FileRes {
  filename: string;
  fileSize?: number;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  formTitle: string = '';
  submit: string = '';
  viewTask?: boolean = true;
  selectedUser?: User;
  files: FileRes[] = [];

  constructor(
    private fileService: FileService,
    private notifierService: NotifierService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ColumnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskAddData
  ) {}

  ngOnInit(): void {
    const origin = this.data.editMode ? 'TASK_CARD' : 'COLUMN';
    this.translate
      .get(`${origin}.FORM.TITLE`)
      .subscribe((title: string) => (this.formTitle = title));
    this.translate
      .get(`${origin}.FORM.SUBMIT`)
      .subscribe((submit: string) => (this.submit = submit));

    this.selectedUser = this.data.users?.find((u) => u.id === this.data.userId);
    this.viewTask = this.data.viewTask;

    if (this.data.task)
      if (this.data.task!.files!.length > 0)
        this.data.task!.files!.forEach((f: FileRes) => this.files.push(f));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid)
      this.dialogRef.close({
        title: this.data.title,
        description: this.data.description,
        userId: this.data.userId,
      });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.fileService.addFile(this.data.task!.id, file).subscribe({
        next: () => {
          this.notifierService.showNotification(
            'File successfully uploaded!',
            'success'
          );
        },
        error: (err) => this.notifierService.showNotification(err),
        complete: () =>
          this.files.push({ filename: file.name, fileSize: file.size }),
      });
    }
  }

  onDownloadFile(filename: string): void {
    this.fileService.getFile(this.data.task!.id, filename).subscribe({
      next: (data) => {
        const blob = new Blob([data], {
          type: `image/${this.findFileExtension(filename)}`,
        });

        const donwloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = donwloadUrl;
        link.download = filename;
        link.click();
      },
      error: (err) => this.notifierService.showNotification(err),
    });
  }

  private findFileExtension(filename: string): string {
    const end = filename.split('').slice(-5);
    return end.slice(end.findIndex((c) => c === '.') + 1).join('');
  }

  // Bytes Formater - source: https://stackoverflow.com/
  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
