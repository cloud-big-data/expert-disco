import * as R from 'ramda';
import { IColumn } from '../types';
import findColumnById from './findColumnById';
import updateColumnById from './updateColumnById';
import updateSmartColumnById from './updateSmartColumnById';

const deepUpdateColumnById = R.curry(
  (
    colId: string,
    updatedData: Partial<IColumn>,
    boardData,
    joinedUpdateData = {},
  ) => {
    const column = findColumnById(colId, boardData);
    return R.pipe(
      updateColumnById(colId, updatedData),
      R.ifElse(
        () => column?.isSmartColumn === true,
        updateSmartColumnById(column?._id ?? '', updatedData),
        R.identity,
      ),
      R.ifElse(
        () => column?.isJoined === true && R.keys(joinedUpdateData).length > 0,
        R.assocPath(['layers', 'joins'], joinedUpdateData),
        R.identity,
      ),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    )(boardData);
  },
);

export default deepUpdateColumnById;
