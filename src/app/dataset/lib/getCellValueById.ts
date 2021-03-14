import { IRow } from '../types';

const getCellValueById = (iterable: IRow[], cellId: string): string => {
  try {
    const rowIndex = iterable.findIndex(row =>
      row.cells.find(cell => cell?._id === cellId),
    );
    const cellValue =
      iterable[rowIndex]?.cells.find(cell => cell?._id === cellId)?.value ?? '';

    return cellValue.toString();
  } catch (e) {
    return '';
  }
};

export default getCellValueById;
