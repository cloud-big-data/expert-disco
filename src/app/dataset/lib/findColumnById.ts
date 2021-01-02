import * as R from 'ramda';
import { IBoardData, IColumn } from '../types';

const findColumnById = R.curry((colId: string, boardData: IBoardData):
  | IColumn
  | undefined => boardData.columns.find(col => col._id === colId));

export default findColumnById;
