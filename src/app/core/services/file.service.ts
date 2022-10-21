import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private url: string = `${environment.apiUrl}/file`;

  constructor(private http: HttpClient) {}

  getFile(taskId: string, filename: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/${taskId}/${filename}`);
  }

  addFile(taskId: string, file: Blob): Observable<null> {
    const formData = new FormData();
    formData.append('taskId', taskId);
    formData.append('file', file);

    return this.http.post<null>(this.url, formData);
  }
}
