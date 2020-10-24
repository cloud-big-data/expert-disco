import { IBoardState, IBoardData, IChangeHistory } from 'app/dataset/types';
import { createContext, MutableRefObject } from 'react';

interface IDatasetContext {
  boardData: IBoardData;
  setBoardData: null | ((data: IBoardData) => void);
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
  changeHistoryRef: React.MutableRefObject<IChangeHistory[]>;
  currentRevision?: MutableRefObject<string | undefined>;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;
