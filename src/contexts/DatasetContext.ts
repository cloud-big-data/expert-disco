import { IBoardState, IBoardData, IBoardHead } from 'app/dataset/types';
import { createContext } from 'react';

interface IDatasetContext {
  readOnly: boolean;
  socket?: SocketIOClient.Socket;
  datasetHead: IBoardHead;
  boardData: IBoardData;
  setBoardData: null | ((data: IBoardData) => void);
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
  changeHistoryRef: React.MutableRefObject<IBoardData[]>;
  currentRevision: number;
  setCurrentRevision: (revision: number) => void;
  undo: () => void;
  redo: () => void;
  getRowSlice: (start: number, end: number) => void;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;
