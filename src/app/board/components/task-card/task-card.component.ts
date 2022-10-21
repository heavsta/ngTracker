import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NotifierService } from 'app/core/services/notifier.service';
import { TaskService } from 'app/core/services/task.service';
import { UserService } from 'app/core/services/user.service';
import { Task } from 'app/shared/models/task.model';
import { User } from 'app/shared/models/user.model';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { TaskComponent } from 'app/board/components/task/task.component';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Input() colId!: string;
  @Input() boardId!: string;
  @Input() users!: User[];
  @Output() deletedTask: EventEmitter<Task> = new EventEmitter();
  userAssigned!: User;
  mouseover: boolean = false;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService
      .getUser(this.task.userId)
      .subscribe((user) => (this.userAssigned = user));
  }

  onEditTask(): void {
    const dialogRef = this.dialog.open(TaskComponent, {
      data: {
        task: this.task,
        title: this.task.title,
        description: this.task.description,
        userId: this.task.userId,
        users: this.users,
        editMode: true,
        viewTask: false,
      },
      width: '400px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (
        res &&
        (res.title !== this.task.title ||
          res.description !== this.task.description ||
          res.userId !== this.task.userId)
      ) {
        this.taskService
          .updateTask(this.boardId, this.colId, this.task.id, {
            title: res.title,
            order: this.task.order,
            description: res.description,
            userId: res.userId,
            boardId: this.boardId,
            columnId: this.colId,
          })
          .subscribe({
            next: (task) => {
              this.task.title = task.title;
              this.task.description = task.description;
              this.task.userId = task.userId;
            },
            error: (err) => this.notifierService.showNotification(err),
          });
      }
    });
  }

  onDeleteTask(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        value: 'TASK',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'true') {
        this.taskService
          .deleteTask(this.boardId, this.colId, this.task.id)
          .subscribe({
            next: () => this.deletedTask.emit(this.task),
            error: (err) => this.notifierService.showNotification(err),
          });
      }
    });
  }

  @HostListener('click', ['$event.target'])
  onClick(el: HTMLElement) {
    if (el.innerText !== 'edit' && el.innerText !== 'delete') {
      const dialogRef = this.dialog.open(TaskComponent, {
        data: {
          task: this.task,
          formTitle: 'Edit Task',
          title: this.task.title,
          description: this.task.description,
          userId: this.task.userId,
          users: this.users,
          action: 'Edit',
          editMode: false,
          viewTask: true,
        },
        width: '400px',
        height: '500px',
      });

      // Update task if files added
      dialogRef.afterClosed().subscribe(() => {
        this.taskService
          .getTask(this.boardId, this.colId, this.task.id)
          .subscribe((t: Task) => {
            if (t.files!.length > this.task.files!.length) {
              this.task = t;
            }
          });
      });
    }
  }
}
