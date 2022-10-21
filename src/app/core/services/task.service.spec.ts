import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AddTaskDto, TaskService } from './task.service';
import { environment } from 'environments/environment';
import { Task } from 'app/shared/models/task.model';

const boardId: string = 'db328e06-e96d-4dda-a340-48c4416b60d4';
const colId: string = 'f07a35f4-4f7e-423c-bea8-39612d9603af';
const expectedUrl: string = `${environment.apiUrl}/boards/${boardId}/columns/${colId}/tasks`;

describe('TaskService', () => {
  let service: TaskService;
  let controller: HttpTestingController;
  let fakeTasks: Task[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    controller = TestBed.inject(HttpTestingController);
    fakeTasks = [
      {
        id: '612fc0d6-be1a-4a39-b01f-7aa696db5917',
        title: 'Task 1',
        order: 1,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
        userId: 'cfb83f66-e3c4-47cd-a324-bc76d275af53',
        boardId: 'db328e06-e96d-4dda-a340-48c4416b60d4',
        columnId: 'f07a35f4-4f7e-423c-bea8-39612d9603af',
        files: [],
      },
      {
        id: 'f88f62c1-cf76-4b99-a33d-5cb95047df82',
        title: 'Task 2',
        order: 2,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
        userId: '4cf6024c-a15c-4024-a294-93f70c350581',
        boardId: 'db328e06-e96d-4dda-a340-48c4416b60d4',
        columnId: 'f07a35f4-4f7e-423c-bea8-39612d9603af',
        files: [],
      },
      {
        id: '50de9e54-fd2c-4ca1-ac0e-f56b2befe745',
        title: 'Task 3',
        order: 3,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
        userId: '775ed491-7064-404c-863b-e46420c3c57e',
        boardId: 'db328e06-e96d-4dda-a340-48c4416b60d4',
        columnId: 'f07a35f4-4f7e-423c-bea8-39612d9603af',
        files: [],
      },
    ];
  });

  it('#getTask(): should get only one task from API', () => {
    let task: Task | undefined;
    const requestedTask: Task = fakeTasks[1];
    service
      .getTask(boardId, colId, requestedTask.id)
      .subscribe((t) => (task = t));

    const request = controller.expectOne(`${expectedUrl}/${requestedTask.id}`);
    request.flush(requestedTask);
    controller.verify();

    expect(task).toEqual(requestedTask);
  });

  it('#getTasks(): should get all tasks from API', () => {
    let tasksArr: Task[] | undefined;
    service.getTasks(boardId, colId).subscribe((tasks) => (tasksArr = tasks));

    const request = controller.expectOne(expectedUrl);
    request.flush(fakeTasks);
    controller.verify();

    expect(tasksArr).toEqual(fakeTasks);
  });

  it('#addTask(): should add one task to the API tasks list', () => {
    let addedTask: AddTaskDto | undefined;
    const taskToAdd: AddTaskDto = {
      id: '73ca5bd9-86e2-4287-9b94-f814c58a25c6',
      title: 'task 20',
      description: 'dded',
      userId: '775ed491-7064-404c-863b-e46420c3c57e',
    };

    service
      .addTask(boardId, colId, {
        title: taskToAdd.title,
        description: taskToAdd.description,
        userId: taskToAdd.userId,
      })
      .subscribe((task) => (addedTask = task));

    const request = controller.expectOne(expectedUrl);
    request.flush(taskToAdd);
    controller.verify();

    expect(addedTask).toEqual(taskToAdd);
  });

  it('#updateTask(): should update a task existing in the API tasks list', () => {
    let updatedTask: Task | undefined;
    const taskToChange: Task = fakeTasks[1];
    const newTitle: string = 'Task Karma 2';

    service
      .updateTask(boardId, colId, taskToChange.id, {
        ...taskToChange,
        title: newTitle,
      })
      .subscribe((task) => (updatedTask = task));

    const request = controller.expectOne(`${expectedUrl}/${taskToChange.id}`);
    const fakeRes = { ...taskToChange, title: newTitle };
    request.flush(fakeRes);
    controller.verify();

    expect(updatedTask).toEqual(fakeRes);
  });

  it('#deleteTask(): should remove a task existing in the API tasks list', () => {
    const taskId: string = 'f88f62c1-cf76-4b99-a33d-5cb95047df82';
    const expectedResult: Task[] = fakeTasks.filter((t) => t.id !== taskId);

    service.deleteTask(boardId, colId, taskId).subscribe();

    const request = controller.expectOne(`${expectedUrl}/${taskId}`);
    request.flush(null);
    controller.verify();

    expect(expectedResult.length).toBe(2);
  });
});
