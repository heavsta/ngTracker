import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { ColumnService } from 'app/core/services/column.service';
import { NotifierService } from 'app/core/services/notifier.service';
import { EditTaskDto, TaskService } from 'app/core/services/task.service';

import { Column } from 'app/shared/models/column.model';
import { Task } from 'app/shared/models/task.model';
import { User } from 'app/shared/models/user.model';

import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { TaskComponent } from 'app/board/components/task/task.component';

export interface TaskAddData {
  task?: Task;
  title: string;
  description: string;
  userId: string;
  users?: User[];
  editMode?: boolean;
  viewTask?: boolean;
}

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  @Input() column!: Column;
  @Input() users!: User[];
  @Input() boardId!: string;
  @Output() columnDeleted: EventEmitter<Column> = new EventEmitter();
  @ViewChild(NgForm) editColForm!: NgForm;
  tasks: Task[] = [];
  mouseover: boolean = false;
  editMode: boolean = false;

  constructor(
    private columnService: ColumnService,
    private taskService: TaskService,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.taskService
      .getTasks(this.route.snapshot.params['id'], this.column.id)
      .subscribe((tasks) => {
        this.tasks = tasks.sort((a, b) => a.order - b.order);
      });
  }

  onActivateEditMode(): void {
    this.editMode = true;
  }

  onDisableEditMode(): void {
    this.editMode = false;
  }

  onEditColumn(): void {
    if (this.editColForm.valid) {
      this.columnService
        .updateColumn(
          this.route.snapshot.params['id'],
          this.column.id,
          this.editColForm.controls['title'].value,
          this.column.order
        )
        .subscribe({
          next: (col) => {
            this.column = col;
            this.editMode = false;
          },
          error: (err) => this.notifierService.showNotification(err),
        });
    }
  }

  onDeleteColumn(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        value: 'COLUMN',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'true') {
        this.columnService
          .deleteColumn(this.route.snapshot.params['id'], this.column.id)
          .subscribe({
            next: () => this.columnDeleted.emit(this.column),
            error: (err) => this.notifierService.showNotification(err),
          });
      }
    });
  }

  onAddTask(): void {
    const dialogRef = this.dialog.open(TaskComponent, {
      data: {
        title: '',
        description: '',
        userId: '',
        users: this.users,
        editMode: false,
        viewTask: false,
      },
      width: '400px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.taskService
          .addTask(this.route.snapshot.params['id'], this.column.id, {
            title: res.title,
            description: res.description,
            userId: res.userId,
          })
          .subscribe({
            next: () => this.loadTasks(),
            error: (err) => this.notifierService.showNotification(err),
          });
      }
    });
  }

  onTaskDeleted(task: Task): void {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
  }

  /**
   * Drag & Drop
   */
  drop(event: CdkDragDrop<Task[]>, droppedColId: string) {
    if (event.previousContainer === event.container) {
      // Case: Task switch within the same container
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.tasks.forEach((task, i) => {
        const taskDto: EditTaskDto = {
          title: task.title,
          order: i + 1,
          description: task.description,
          userId: task.userId,
          boardId: task.boardId,
          columnId: task.columnId,
        };
        this.taskService
          .updateTask(this.boardId, this.column.id, task.id, taskDto)
          .subscribe();
      });
    } else {
      // Case: Task switch between different containers
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const selectedTask = event.container.data[event.currentIndex];
      const draggedColId = selectedTask.columnId;

      this.taskService
        .updateTask(this.boardId, draggedColId, selectedTask.id, {
          title: selectedTask.title,
          order: event.currentIndex + 1,
          description: selectedTask.description,
          userId: selectedTask.userId,
          boardId: selectedTask.boardId,
          columnId: droppedColId,
        })
        .subscribe({
          next: () => this.loadTasks(),
          error: (err) => this.notifierService.showNotification(err),
        });
    }
  }
}
