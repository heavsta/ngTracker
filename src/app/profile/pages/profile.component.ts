import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { map, tap } from 'rxjs';

import { AuthService } from 'app/core/services/auth.service';
import { NotifierService } from 'app/core/services/notifier.service';
import { User } from 'app/shared/models/user.model';
import { UserService } from 'app/core/services/user.service';
import { PasswordMatchingValidator } from 'app/shared/directives/password-matching.directive';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  editForm!: FormGroup;
  userId: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Init Form
    this.editForm = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        login: new FormControl(null, Validators.required),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ]),
        confirm: new FormControl(null, Validators.required),
      },
      { validators: PasswordMatchingValidator }
    );
    // Get User data
    this.userId = JSON.parse(localStorage.getItem('user')!).userId;
    if (this.userId)
      this.userService
        .getUser(this.userId)
        .pipe(
          map((user) => {
            this.editForm.controls['name'].setValue(user.name);
            this.editForm.controls['login'].setValue(user.login);
          })
        )
        .subscribe();
  }

  getErrorMessage(field: AbstractControl): string {
    if (field.hasError('pattern')) {
      return 'Your Password must be 8 characters long, including 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character.';
    }

    return 'You must enter a value.';
  }

  onDeleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        value: 'ACCOUNT',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'true' && this.userId) {
        this.userService
          .deleteUser(this.userId)
          .subscribe(() => this.authService.logout());
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    const userData: Required<Pick<User, 'name' | 'login' | 'password'>> = {
      name: this.editForm.controls['name'].value.trim(),
      login: this.editForm.controls['login'].value.trim(),
      password: this.editForm.controls['password'].value,
    };

    this.userService
      .updateUser(this.userId, userData)
      .pipe(
        tap((user: User) => {
          this.authService.userSubject.next(user);
        })
      )
      .subscribe({
        next: (res) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.notifierService.showNotification(err.message),
      });
  }
}
