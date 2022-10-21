import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'app/core/services/auth.service';
import { NotifierService } from 'app/core/services/notifier.service';
import { PasswordMatchingValidator } from 'app/shared/directives/password-matching.directive';
import { User } from 'app/shared/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hidePwd: boolean = true;
  hideCfrm: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup(
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
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const userData: Required<Pick<User, 'name' | 'login' | 'password'>> = {
      name: this.signupForm.controls['name'].value.trim(),
      login: this.signupForm.controls['login'].value.trim(),
      password: this.signupForm.controls['password'].value,
    };

    this.authService.signup(userData).subscribe({
      next: () => {
        this.authService
          .login({
            login: userData.login,
            password: userData.password,
          })
          .subscribe(() => {
            this.router.navigate(['/dashboard']);
            this.translate
              .get('SIGNUP.SUCCESS')
              .subscribe((str: string) =>
                this.notifierService.showNotification(str, 'success')
              );
          });
      },
      error: (err) => this.notifierService.showNotification(err.message),
    });
  }
}
