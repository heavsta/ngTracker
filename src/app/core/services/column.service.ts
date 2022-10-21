import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { Column } from 'app/shared/models/column.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private url: string = `${environment.apiUrl}/boards`;

  constructor(private http: HttpClient) {}

  getColumn(boardId: string, colId: string): Observable<Column> {
    return this.http.get<Column>(`${this.url}/${boardId}/columns/${colId}`);
  }

  getColumns(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.url}/${boardId}/columns`);
  }

  addColumn(boardId: string, title: string): Observable<Column> {
    return this.http.post<Column>(
      `${this.url}/${boardId}/columns`,
      { title },
      httpOptions
    );
  }

  updateColumn(
    boardId: string,
    colId: string,
    title: string,
    order: number
  ): Observable<Column> {
    return this.http.put<Column>(
      `${this.url}/${boardId}/columns/${colId}`,
      { title, order },
      httpOptions
    );
  }

  deleteColumn(boardId: string, colId: string): Observable<null> {
    return this.http.delete<null>(`${this.url}/${boardId}/columns/${colId}`);
  }
}
