import { IBoardData } from '../types';

const getColumnNameById = (columnId: string, boardData: IBoardData) =>
  boardData.columns.find(col => col._id === columnId)?.value;

export default getColumnNameById;
