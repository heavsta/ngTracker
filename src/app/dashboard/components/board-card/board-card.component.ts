import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Board } from 'app/shared/models/board.model';
import { BoardService } from 'app/core/services/board.service';
import { NotifierService } from 'app/core/services/notifier.service';
import { BoardFormComponent } from 'app/dashboard/components/board-form/board-form.component';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss'],
})
export class BoardCardComponent {
  @Input() board!: Board;
  @Output() boardDeleted: EventEmitter<Board> = new EventEmitter();

  constructor(
    private router: Router,
    private boardService: BoardService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  @HostListener('click', ['$event.target'])
  onClick(el: HTMLElement) {
    if (el.innerText !== 'more_horiz') {
      this.router.navigate(['/board', this.board.id]);
    }
  }

  onEditBoard(): void {
    const dialogRef = this.dialog.open(BoardFormComponent, {
      data: {
        formTitle: 'Edit board',
        title: this.board.title,
        description: this.board.description,
        action: 'Edit',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (
        res &&
        (res.title !== this.board.title ||
          res.description !== this.board.description)
      ) {
        this.boardService
          .updateBoard(this.board.id, res.title, res.description)
          .subscribe({
            next: (board: Board) => {
              this.board.title = board.title;
              this.board.description = board.description;
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
        this.boardService.deleteBoard(this.board.id).subscribe({
          next: () => this.boardDeleted.emit(this.board),
          error: (err) => this.notifierService.showNotification(err.message),
        });
      }
    });
  }
}
