import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ColumnService } from './column.service';
import { environment } from 'environments/environment';
import { Column } from 'app/shared/models/column.model';

const boardId: string = 'db328e06-e96d-4dda-a340-48c4416b60d4';
const expectedUrl: string = `${environment.apiUrl}/boards/${boardId}/columns`;

describe('ColumnService', () => {
  let service: ColumnService;
  let controller: HttpTestingController;
  let fakeCols: Column[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ColumnService],
    });
    service = TestBed.inject(ColumnService);
    controller = TestBed.inject(HttpTestingController);
    fakeCols = [
      {
        id: 'f07a35f4-4f7e-423c-bea8-39612d9603af',
        title: 'one',
        order: 1,
      },
      {
        id: '33762edc-8605-4985-a568-543deb1f1466',
        title: 'two',
        order: 2,
      },
      {
        id: 'b4dc4803-e8c2-414b-8679-1af1f781b393',
        title: 'three',
        order: 3,
      },
    ];
  });

  it('#getColumn(): should get only one column from API', () => {
    let col: Column | undefined;
    const requestedCol: Column = fakeCols[1];
    service
      .getColumn(boardId, requestedCol.id)
      .subscribe((column) => (col = column));

    const request = controller.expectOne(`${expectedUrl}/${requestedCol.id}`);
    request.flush(requestedCol);
    controller.verify();

    expect(col).toEqual(requestedCol);
  });

  it('#getColumns(): should get all columns from API', () => {
    let colsArr: Column[] | undefined;
    service.getColumns(boardId).subscribe((columns) => (colsArr = columns));

    const request = controller.expectOne(expectedUrl);
    request.flush(fakeCols);
    controller.verify();

    expect(colsArr).toEqual(fakeCols);
  });

  it('#addColumn(): should add one column to the API columns list', () => {
    let addedCol: Column | undefined;
    const colToAdd: Column = {
      id: '7489488e-2e42-494c-a0ed-805c28ffd422',
      title: 'four',
      order: 4,
    };

    service
      .addColumn(boardId, colToAdd.title)
      .subscribe((col) => (addedCol = col));

    const request = controller.expectOne(expectedUrl);
    request.flush(colToAdd);
    controller.verify();

    expect(addedCol).toEqual(colToAdd);
  });

  it('#updateColumn(): should update a column existing in the API columns list', () => {
    let updatedCol: Column | undefined;
    const coltoChange: Column = fakeCols[1];
    const newTitle: string = 'Karma two';

    service
      .updateColumn(boardId, coltoChange.id, newTitle, coltoChange.order)
      .subscribe((col) => (updatedCol = col));

    const request = controller.expectOne(`${expectedUrl}/${coltoChange.id}`);
    const fakeRes = { ...coltoChange, title: newTitle };
    request.flush(fakeRes);
    controller.verify();

    expect(updatedCol).toEqual(fakeRes);
  });

  it('#deleteColumn(): should remove a column existing in the API columns list', () => {
    const colId: string = '33762edc-8605-4985-a568-543deb1f1466';
    const expectedResult: Column[] = fakeCols.filter((c) => c.id !== colId);

    service.deleteColumn(boardId, colId).subscribe();

    const request = controller.expectOne(`${expectedUrl}/${colId}`);
    request.flush(null);
    controller.verify();

    expect(expectedResult.length).toBe(2);
  });
});
