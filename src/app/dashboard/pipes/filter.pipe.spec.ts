import { Board } from '../../shared/models/board.model';
import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;
  let fakeBoards: Board[];

  beforeEach(() => {
    pipe = new FilterPipe();
    fakeBoards = [
      {
        id: 'db328e06-e96d-4dda-a340-48c4416b60d4',
        title: 'Test howdy 1',
        description: 'This is board test n°1',
      },
      {
        id: '5b8006ab-1e15-4d9e-b45d-16e7e32c058c',
        title: 'Test 2',
        description: 'This is test board n°2',
      },
      {
        id: '740849be-f3f8-4e27-bfac-d93506e30d3f',
        title: 'Test 3 howdy',
        description: 'This is test board n°3',
      },
    ];
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter titles containing the world "howdy"', () => {
    const input: string = 'howdy';
    expect(pipe.transform(fakeBoards, input)).toEqual(
      fakeBoards.filter(
        (b) => b.title.toLowerCase().indexOf(input.toLowerCase()) !== -1
      )
    );
  });
});
