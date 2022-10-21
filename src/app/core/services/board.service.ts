import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { Board } from 'app/shared/models/board.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private url: string = `${environment.apiUrl}/boards`;
  newBoardSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.url}/${id}`);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.url}`);
  }

  addBoard(title: string, description: string): Observable<Board> {
    return this.http.post<Board>(
      `${this.url}`,
      { title, description },
      httpOptions
    );
  }

  updateBoard(
    id: string,
    title: string,
    description: string
  ): Observable<Board> {
    return this.http.put<Board>(
      `${this.url}/${id}`,
      { title, description },
      httpOptions
    );
  }

  deleteBoard(id: string): Observable<null> {
    return this.http.delete<null>(`${this.url}/${id}`);
  }
}
