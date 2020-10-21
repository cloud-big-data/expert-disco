import { IBoardState, IBoardData } from 'app/dataset/types';
import { createContext } from 'react';

interface IDatasetContext {
  boardData: IBoardData;
  setBoardData:
    null | ((data: IBoardData) => void);
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;