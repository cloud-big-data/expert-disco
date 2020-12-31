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
  changeHistoryRef: React.MutableRefObject<string[]>;
  getRowSlice: (start: number, end: number) => void;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;
