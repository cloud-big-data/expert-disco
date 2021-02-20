import { IBoardData, ISmartColumn } from '../types';

const updateSmartColumnById = (
  colId: string,
  updatedData: Partial<ISmartColumn>,
  boardData: IBoardData,
) => ({
  ...boardData,
  layers: {
    ...boardData.layers,
    smartColumns: boardData.layers.smartColumns.map(col =>
      col._id === colId ? { ...col, ...updatedData } : col,
    ),
  },
});

export default updateSmartColumnById;
