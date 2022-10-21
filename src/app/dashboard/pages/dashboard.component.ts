import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { Board } from 'app/shared/models/board.model';
import { BoardService } from 'app/core/services/board.service';
import { NotifierService } from 'app/core/services/notifier.service';
import { BoardFormComponent } from 'app/dashboard/components/board-form/board-form.component';

export interface BoardAddData {
  title: string;
  description: string;
  editMode?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  boards: Board[] = [];
  searchFilter: string = '';
  sub!: Subscription;

  constructor(
    private boardService: BoardService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.boardService.getBoards().subscribe((boards) => (this.boards = boards));
    // Calling onCreateBoard only if click event on header btn
    this.sub = this.boardService.newBoardSubject.subscribe((res: boolean) => {
      if (res) this.onCreateBoard();
    });
  }

  onBoardDeleted(board: Board): void {
    this.boards = this.boards.filter((b) => b !== board);
  }

  onCreateBoard(): void {
    const dialogRef = this.dialog.open(BoardFormComponent, {
      data: {
        title: '',
        description: '',
        editMode: false,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.boardService.addBoard(res.title, res.description).subscribe({
          next: (board: Board) => this.boards.push(board),
          error: (err) => this.notifierService.showNotification(err.message),
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.boardService.newBoardSubject.next(false);
  }
}
