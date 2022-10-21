import { Pipe, PipeTransform } from '@angular/core';
import { Board } from 'app/shared/models/board.model';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(boards: Board[], input: string): Board[] {
    if (boards.length === 0 || input.length === 0) {
      return boards;
    }

    const filteredBoards: Board[] = [];

    for (let board of boards) {
      if (board.title.toLowerCase().includes(input.toLowerCase())) {
        filteredBoards.push(board);
      }
    }

    return filteredBoards;
  }
}
