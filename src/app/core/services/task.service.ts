import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { Task } from 'app/shared/models/task.model';

export interface AddTaskDto {
  id?: string;
  title: string;
  description: string;
  userId: string;
}

export interface EditTaskDto {
  id?: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url: string = `${environment.apiUrl}/boards`;

  constructor(private http: HttpClient) {}

  getTask(boardId: string, colId: string, taskId: string): Observable<Task> {
    return this.http.get<Task>(
      `${this.url}/${boardId}/columns/${colId}/tasks/${taskId}`
    );
  }

  getTasks(boardId: string, colId: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.url}/${boardId}/columns/${colId}/tasks`
    );
  }

  addTask(
    boardId: string,
    colId: string,
    data: AddTaskDto
  ): Observable<AddTaskDto> {
    return this.http.post<AddTaskDto>(
      `${this.url}/${boardId}/columns/${colId}/tasks`,
      data,
      httpOptions
    );
  }

  updateTask(
    boardId: string,
    colId: string,
    taskId: string,
    data: EditTaskDto
  ): Observable<Task> {
    return this.http.put<Task>(
      `${this.url}/${boardId}/columns/${colId}/tasks/${taskId}`,
      data
    );
  }

  deleteTask(boardId: string, colId: string, taskId: string): Observable<null> {
    return this.http.delete<null>(
      `${this.url}/${boardId}/columns/${colId}/tasks/${taskId}`
    );
  }
}
