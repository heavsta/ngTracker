import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(private snackBar: MatSnackBar) {}

  showNotification(message: string, klass: string = 'error') {
    this.snackBar.open(
      klass === 'error' ? `❌ ${message}` : `✅ ${message}`,
      'X',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: `display-${klass}`,
      }
    );
  }
}
