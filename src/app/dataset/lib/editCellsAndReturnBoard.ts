import * as R from 'ramda';
import returnUpdatedCells, { ICellUpdates } from './returnUpdatedCells';
import { IRow, ICell, IBoardData } from '../types';

const editCellsAndReturnBoard = R.curry(
  (cellUpdates: ICellUpdates<ICell>['cellUpdates'], boardData: IBoardData) => {
    const cells = (row: IRow) =>
      returnUpdatedCells<ICell>({
        iterable: row.cells,
        cellUpdates: [...cellUpdates],
      })!;

    const populateRow = (row: IRow) => R.assoc('cells', cells(row), row);

    return R.assoc('rows', R.map(populateRow)(boardData.rows), boardData);
  },
);

export default editCellsAndReturnBoard;
