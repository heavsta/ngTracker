import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { environment } from 'environments/environment';
import { Login } from 'app/shared/models/login.model';
import { User } from 'app/shared/models/user.model';

export interface Jwt {
  token: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  signup(
    user: Required<Pick<User, 'name' | 'login' | 'password'>>
  ): Observable<User> {
    return this.http.post<User>(`${this.url}/signup`, user, httpOptions);
  }

  login(login: Login): Observable<Jwt> {
    return this.http.post<Jwt>(`${this.url}/signin`, login, httpOptions).pipe(
      tap({
        next: (jwt: Jwt) => {
          this.setToken(jwt.token);
          this.userSubject.next(this.decodeJwt(jwt.token));
        },
      })
    );
  }

  autoLogin(): void {
    const token = this.getToken();
    if (token) this.userSubject?.next(this.decodeJwt(token));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token !== null ? JSON.parse(token) : token;
  }

  setToken(token: string): void {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(this.decodeJwt(token)));
  }

  decodeJwt(jwt: string): any {
    try {
      return jwt_decode(jwt);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
