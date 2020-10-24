import { v4 as uuidv4 } from 'uuid';
import { DataTypes, IBoardData } from '../types';

export const makeToolbarActions = (boardData: IBoardData) => {
  const colLength = boardData.columns.length;
  return {
    /**
     * @param {string[]} cellValues - Must be of the same length as boardData.columns
     */
    newRow: (cellValues?: string[]) => {
      if (cellValues && cellValues.length !== colLength) {
        throw new Error(
          'cellValues length must be equal to the number of columns in the dataset.',
        );
      }

      return {
        ...boardData,
        rows: [
          ...boardData.rows,
          {
            _id: uuidv4(),
            cells: boardData.rows[0].cells.map((cell, index) => ({
              ...cell,
              _id: uuidv4(),
              value: cellValues ? cellValues[index] : null,
            })),
          },
        ],
      };
    },
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
  };
};
