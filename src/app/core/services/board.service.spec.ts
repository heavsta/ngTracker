import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BoardService } from './board.service';
import { environment } from 'environments/environment';
import { Board } from 'app/shared/models/board.model';

const expectedUrl: string = `${environment.apiUrl}/boards`;

describe('BoardService', () => {
  let service: BoardService;
  let controller: HttpTestingController;
  let fakeBoards: Board[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoardService],
    });
    service = TestBed.inject(BoardService);
    controller = TestBed.inject(HttpTestingController);
    fakeBoards = [
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
  });

  it('#getBoard(): should get only one board from API', () => {
    let board: Board | undefined;
    const requestedBoard: Board = fakeBoards[1];
    service.getBoard(requestedBoard.id).subscribe((brd) => (board = brd));

    const request = controller.expectOne(`${expectedUrl}/${requestedBoard.id}`);
    request.flush(requestedBoard);
    controller.verify();

    expect(board).toEqual(requestedBoard);
  });

  it('#getBoards(): should get all boards from API', () => {
    let boardsArr: Board[] | undefined;
    service.getBoards().subscribe((boards) => (boardsArr = boards));

    const request = controller.expectOne(expectedUrl);
    request.flush(fakeBoards);
    controller.verify();

    expect(boardsArr).toEqual(fakeBoards);
  });

  it('#addBoard(): should add one board to the API boards list', () => {
    let addedBoard: Board | undefined;
    const boardToAdd: Board = {
      id: '9a111e19-24ec-43e1-b8c4-13776842b8d5',
      title: 'Test 4',
      description: 'This is test board n°4',
    };

    service
      .addBoard(boardToAdd.title, boardToAdd.description)
      .subscribe((board) => (addedBoard = board));

    const request = controller.expectOne(expectedUrl);
    request.flush(boardToAdd);
    controller.verify();

    expect(addedBoard).toEqual(boardToAdd);
  });

  it('#updateBoard(): should update a board existing in the API boards list', () => {
    let updatedBoard: Board | undefined;
    const boardId: string = '5b8006ab-1e15-4d9e-b45d-16e7e32c058c';
    const newTitle: string = 'Karma 2';
    const newDesc: string = 'This is karma board n°2';

    service
      .updateBoard(boardId, newTitle, newDesc)
      .subscribe((board) => (updatedBoard = board));

    const request = controller.expectOne(`${expectedUrl}/${boardId}`);
    const fakeRes = {
      id: fakeBoards.find((b) => b.id === boardId)!.id,
      title: newTitle,
      description: newDesc,
    };
    request.flush(fakeRes);
    controller.verify();

    expect(updatedBoard).toEqual(fakeRes);
  });

  it('#deleteBoard(): should remove a board existing in the API boards list', () => {
    const boardId: string = '5b8006ab-1e15-4d9e-b45d-16e7e32c058c';
    const expectedResult: Board[] = fakeBoards.filter((b) => b.id !== boardId);

    service.deleteBoard(boardId).subscribe();

    const request = controller.expectOne(`${expectedUrl}/${boardId}`);
    request.flush(null);
    controller.verify();

    expect(expectedResult.length).toBe(2);
  });
});
