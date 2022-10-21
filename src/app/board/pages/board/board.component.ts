import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { BoardService } from 'app/core/services/board.service';
import { ColumnService } from 'app/core/services/column.service';
import { NotifierService } from 'app/core/services/notifier.service';
import { UserService } from 'app/core/services/user.service';
import { Board } from 'app/shared/models/board.model';
import { Column } from 'app/shared/models/column.model';
import { User } from 'app/shared/models/user.model';
import { BoardDialogComponent } from 'app/board/components/board-dialog/board-dialog.component';
import { BoardFormComponent } from 'app/dashboard/components/board-form/board-form.component';
import { ColumnFormComponent } from 'app/board/components/column-form/column-form.component';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';

export interface ColumnAddData {
  title: string;
  editMode?: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId!: string;
  board?: Board;
  columns: Column[] = [];
  users: User[] = [];
  boards: Board[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private columnService: ColumnService,
    private userService: UserService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Load all users
    this.userService.getUsers().subscribe((users) => (this.users = users));
    // Listen to route changes
    this.route.url.subscribe(() => {
      // Get boardId from url
      this.boardId = this.route.snapshot.params['id'];
      // Load board data
      this.boardService.getBoard(this.boardId).subscribe({
        next: (board) => (this.board = board),
        error: (err) => {
          this.router.navigate(['/dashboard']);
          this.notifierService.showNotification(err);
        },
      });
      // Load board columns
      this.columnService.getColumns(this.boardId).subscribe({
        next: (columns) => {
          this.columns = columns.sort((a, b) => a.order - b.order);
        },
        error: (err) => this.notifierService.showNotification(err),
      });
    });
    // Load sidenav boards
    this.boardService.getBoards().subscribe((boards) => (this.boards = boards));
  }

  onAddColumn(): void {
    const dialogRef = this.dialog.open(ColumnFormComponent, {
      data: {
        title: '',
        editMode: false,
      },
    });

    dialogRef.afterClosed().subscribe((title) => {
      if (title) {
        this.columnService.addColumn(this.boardId, title).subscribe({
          next: (column) => this.columns.push(column),
          error: (err) => this.notifierService.showNotification(err),
        });
      }
    });
  }

  onColumnDeleted(col: Column): void {
    this.columns = this.columns.filter((c) => c.id !== col.id);
  }

  onAboutBoard(): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      data: { title: this.board?.title, description: this.board?.description },
    });
  }

  onEditBoard(): void {
    const dialogRef = this.dialog.open(BoardFormComponent, {
      data: {
        formTitle: 'Edit board',
        title: this.board?.title,
        description: this.board?.description,
        action: 'Edit',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (
        res &&
        (res.title !== this.board?.title ||
          res.description !== this.board?.description)
      ) {
        this.boardService
          .updateBoard(this.board!.id, res.title, res.description)
          .subscribe({
            next: (board: Board) => {
              this.board!.title = board.title;
              this.board!.description = board.description;
              // Edit Sidenav boards list
              this.boards.map((b) => {
                b.id === this.boardId ? (b.title = board.title) : b;
              });
            },
            error: (err) => this.notifierService.showNotification(err.message),
          });
      }
    });
  }

  onDeleteBoard(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        value: 'BOARD',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'true') {
        this.boardService.deleteBoard(this.boardId).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (err) => this.notifierService.showNotification(err),
        });
      }
    });
  }

  /*
   * Drag & Drop
   */
  onChangeColOrder(col: Column, newOrder: number): void {
    this.columnService
      .updateColumn(this.boardId, col.id, col.title, newOrder)
      .subscribe();
  }

  drop(event: CdkDragDrop<Column[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);

    this.columns.forEach((col, i) => {
      this.onChangeColOrder(col, i + 1);
    });
  }

  // SIDENAV
  onSidenavBoardClick(id: string): void {
    this.router.navigate(['/board', id]);
  }
}
