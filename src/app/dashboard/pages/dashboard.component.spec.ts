import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { Board } from 'app/shared/models/board.model';
import { BoardService } from 'app/core/services/board.service';
import { FilterPipe } from 'app/dashboard/pipes/filter.pipe';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let fakeBoardService: BoardService;
  const boards: Board[] = [
    {
      id: 'db328e06-e96d-4dda-a340-48c4416b60d4',
      title: 'Test 1',
      description: 'This is board test n°1',
    },
    {
      id: '5b8006ab-1e15-4d9e-b45d-16e7e32c058c',
      title: 'Test 2',
      description: 'This is test board n°2',
    },
    {
      id: '740849be-f3f8-4e27-bfac-d93506e30d3f',
      title: 'Test 3',
      description: 'This is test board n°3',
    },
  ];

  beforeEach(async () => {
    fakeBoardService = jasmine.createSpyObj<BoardService>('BoardService', {
      getBoards: of(boards),
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [DashboardComponent, FilterPipe],
      providers: [
        { provide: BoardService, userValue: fakeBoardService },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#ngOnInit(): should get all the boards from API', () => {
    fakeBoardService
      .getBoards()
      .subscribe((boards) => (component.boards = boards));

    expect(component.boards).toBeTruthy();
    expect(component.boards.length).toBe(3);
  });

  it('#onBoardDeleted(): should remove a board from the component boards array', () => {
    fakeBoardService
      .getBoards()
      .subscribe((boards) => (component.boards = boards));

    component.onBoardDeleted(boards[1]);

    expect(component.boards.length).toBe(2);
  });

  it('#onCreateBoard(): should open a dialog', () => {
    fakeBoardService
      .getBoards()
      .subscribe((boards) => (component.boards = boards));

    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () =>
        of({
          title: 'My board title',
          description: 'My board description',
        }),
    } as MatDialogRef<typeof component>);

    component.onCreateBoard();

    expect(dialogSpy).toHaveBeenCalled();
  });
});
