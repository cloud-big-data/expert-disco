import * as R from 'ramda';
import { IBoardData, IColumn } from '../types';

const updateColumnById = R.curry(
  (_id: string, updatedValue: Partial<IColumn>, boardData: IBoardData) => ({
    ...boardData,
    columns: boardData.columns.map(col =>
      col._id === _id
        ? {
            ...col,
            ...updatedValue,
          }
        : col,
    ),
  }),
);

export default updateColumnById;
