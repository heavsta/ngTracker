import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { User } from 'app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}`);
  }

  updateUser(
    id: string,
    userData: Required<Pick<User, 'name' | 'login' | 'password'>>
  ): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, userData);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
