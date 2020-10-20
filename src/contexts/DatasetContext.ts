import { IBoardState, IDataset } from 'app/dataset/types';
import { createContext } from 'react';

interface IDatasetContext {
  gridData: IDataset;
  setGridData:
    null | ((data: IDataset) => void);
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;