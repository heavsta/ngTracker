import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';

import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'app/core/services/auth.service';
import { environment } from 'environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private url: string = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = '';
        if (err.error instanceof Error) {
          this.translate
            .get('HTTP.ERROR.CLIENT_SIDE')
            .subscribe((err: string) => (errorMessage = err));
        } else {
          /**  401 Unauthorized throughout the app */
          if (err.status === 401) {
            this.translate
              .get('HTTP.ERROR.EXPIRED_TOKEN')
              .subscribe((err: string) => (errorMessage = err));

            // Logout user in case of expired token
            if (this.authService.getToken()) {
              this.authService.logout();
            }
          }

          /**  401 Unauthorized throughout the app */
          if (err.status === 403) {
            this.translate
              .get('HTTP.ERROR.RIGHTS')
              .subscribe((err: string) => (errorMessage = err));
          }

          /** Signup error handling */
          if (request.url === `${this.url}/signup`) {
            switch (err.status) {
              case 403:
                this.translate
                  .get('HTTP.ERROR.CREDENTIALS')
                  .subscribe((err: string) => (errorMessage = err));
                break;
              case 409:
                this.translate
                  .get('HTTP.ERROR.USERNAME_TAKEN')
                  .subscribe((err: string) => (errorMessage = err));
                break;
            }
          }

          /** Login error handling */
          if (request.url === `${this.url}/signin` && err.status === 403) {
            this.translate
              .get('HTTP.ERROR.CREDENTIALS')
              .subscribe((err: string) => (errorMessage = err));
          }

          /** Profile Edit error handling */
          if (request.url.startsWith(`${this.url}/users/`)) {
            switch (err.status) {
              case 500:
                this.translate
                  .get('HTTP.ERROR.USERNAME_TAKEN')
                  .subscribe((err: string) => (errorMessage = err));
                break;
              case 409:
                this.translate
                  .get('HTTP.ERROR.FILE_TYPE')
                  .subscribe((err: string) => (errorMessage = err));
                break;
            }
          }

          /** File error handling */
          if (request.url.startsWith(`${this.url}/file`)) {
            switch (err.status) {
              case 200:
                return EMPTY;
              case 404:
                this.translate
                  .get('HTTP.ERROR.CREDENTIALS')
                  .subscribe((err: string) => (errorMessage = err));
                break;
              case 409:
                this.translate
                  .get('HTTP.ERROR.FILE_TYPE')
                  .subscribe((err: string) => (errorMessage = err));
                break;
            }
          }

          /** Unknown Error */
          if (errorMessage === '') {
            this.translate
              .get('HTTP.ERROR.UNKNOWN')
              .subscribe((err: string) => (errorMessage = err));
          }
        }

        /** Throw Error */
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
