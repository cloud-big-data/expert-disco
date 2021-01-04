import * as R from 'ramda';
import { IBoardData, IRow } from '../types';

const findRowById = R.curry((rowId: string, boardData: IBoardData):
  | IRow
  | undefined => boardData.rows.find(row => row._id === rowId));

export default findRowById;
