import { v4 as uuidv4 } from 'uuid';
import { IBoardData } from '../types';

export const makeBoardActions = (boardData: IBoardData) => {
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
            index: boardData.rows.length,
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
          value: value || `Column ${boardData.columns.length + 1}`,
          dataType: 'string',
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
    removeColumn: (colId: string) => {
      const targetIndex = boardData.columns.findIndex(col => col._id === colId);
      return {
        ...boardData,
        columns: boardData.columns.filter(col => col._id !== colId),
        rows: boardData.rows.map(row => ({
          ...row,
          cells: row.cells.filter((cell, index) => index !== targetIndex),
        })),
      };
    },
    removeRow: (rowId: string) => ({
      ...boardData,
      rows: boardData.rows.filter(row => row._id !== rowId),
    }),
    changeColWidth: (colId: string, newWidth: number) => ({
      ...boardData,
      columns: boardData.columns.map(col => ({
        ...col,
        colWidth: col._id === colId ? newWidth : col.colWidth,
      })),
    }),
  };
};
