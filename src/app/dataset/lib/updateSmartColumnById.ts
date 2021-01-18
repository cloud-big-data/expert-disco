import { IBoardData, ISmartColumn } from '../types';

const updateSmartColumnById = (
  colId: string,
  updatedData: Partial<ISmartColumn>,
  boardData: IBoardData,
) =>
  boardData.layers.smartColumns.map(col =>
    col._id === colId ? { ...col, ...updatedData } : col,
  );

export default updateSmartColumnById;
