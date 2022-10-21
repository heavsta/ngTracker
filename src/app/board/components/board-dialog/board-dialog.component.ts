import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-board-dialog',
  template: `
    <div>
      <h2>{{ data.title }}</h2>
      <p>{{ data.description }}</p>
    </div>
  `,
  styles: ['div{padding: 25px} p{max-width: 350px;}'],
})
export class BoardDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }
  ) {}
}
