import * as R from 'ramda';
import { IBoardData, IRow } from '../types';
import sortKeysByColumnOrder from './sortKeysByColumnOrder';

const sortDatasetByColumnOrder = (colOrder: string[], baseState: IBoardData) => ({
  ...baseState,
  columns: sortKeysByColumnOrder(colOrder, '_id')(baseState.columns),
  rows: R.map((row: IRow) => ({
    ...row,
    cells: sortKeysByColumnOrder(colOrder, 'columnId')(row.cells),
  }))(baseState.rows),
});

export default sortDatasetByColumnOrder;
