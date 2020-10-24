import { v4 as uuidv4 } from 'uuid';
import { DataTypes, IBoardData } from '../types';

export const makeToolbarActions = (boardData: IBoardData) => ({
  newRow: (value?: string) => ({
    ...boardData,
    rows: [
      ...boardData.rows,
      {
        _id: uuidv4(),
        cells: boardData.rows[0].cells.map(cell => ({
          ...cell,
          _id: uuidv4(),
          value: value ?? '',
        })),
      },
    ],
  }),
  newColumn: (value?: string) => ({
    ...boardData,
    columns: [
      ...boardData.columns,
      {
        _id: uuidv4(),
        value: value ?? '',
        dataType: DataTypes.string,
      },
    ],
    rows: boardData.rows.map(row => ({
      ...row,
      cells: [
        ...row.cells,
        {
          _id: uuidv4(),
          value: '',
        },
      ],
    })),
  }),
});
