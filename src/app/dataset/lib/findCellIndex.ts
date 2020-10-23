import { IRow } from '../types';

const findCellCoordinates = (iterable: IRow[], cellId: string): [number, number] => {
  const rowIndex = iterable.findIndex(row =>
    row.cells.find(cell => cell._id === cellId),
  );
  const cellIndex = iterable[rowIndex].cells.findIndex(cell => cell._id === cellId);

  return [rowIndex, cellIndex];
};

export default findCellCoordinates;
