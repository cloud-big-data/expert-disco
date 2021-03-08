import { IBoardState, IBoardData, IBoardHead } from 'app/dataset/types';
import { createContext } from 'react';
import { RefetchOptions } from 'react-query/types/core/query';

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
  clipboard?: string;
  setClipboard: (val?: string) => void;
  queriedDatasets: Pick<
    IBoardData,
    'columns' | 'visibilitySettings' | 'layers' | '_id'
  >[];
  setQueriedDatasets: (
    queriedDatasets: Pick<
      IBoardData,
      'columns' | 'visibilitySettings' | 'layers' | '_id'
    >[],
  ) => void;
  refetch: (options?: RefetchOptions) => void;
}

const DatasetContext = createContext<null | IDatasetContext>(null);

export default DatasetContext;
