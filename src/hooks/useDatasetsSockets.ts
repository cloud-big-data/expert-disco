import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { IBoardData } from 'app/dataset/types';
import * as R from 'ramda';

const getDatasetsWSUrl = () => {
  if (process.env.NODE_ENV === 'production')
    return 'https://xs.datasets.skyvueservices.com';
  return 'ws://localhost:3030';
};

const useDatasetsSockets = (
  query: { userId: string | null; datasetId?: string },
  board: {
    boardData?: IBoardData;
    setBoardData: (boardData: IBoardData) => void;
  },
  changeHistoryRef: React.MutableRefObject<Array<IBoardData>>,
) => {
  const { userId, datasetId } = query;
  const { boardData, setBoardData } = board;
  const [socketObj, setSocket] = useState<SocketIOClient.Socket | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!userId || !datasetId) return;
    const socket = io(getDatasetsWSUrl(), {
      query: {
        datasetId,
        userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      setSocket(socket);
      if (!boardData) {
        socket.emit('loadDataset');
      }
    });

    socket.on('initialDatasetReceived', (res: IBoardData) => {
      if (!boardData) {
        setBoardData(res);
        changeHistoryRef.current = [res];
      }
    });

    socket.on('slice', (res: IBoardData) => {
      const lastIndex = (iterable: IBoardData['rows']) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        R.prop('index', R.last(iterable));

      if (lastIndex(res.rows) !== lastIndex(boardData!.rows)) {
        setBoardData(res);
      }
    });

    socket.on('returnDiff', (data: any) => {
      console.log(data);
    });

    return () =>
      ['connect', 'initialDatasetReceived', 'slice', 'returnDiff'].forEach(cnxn =>
        socket.off(cnxn),
      );
  }, [userId, datasetId, boardData, setBoardData, changeHistoryRef]);

  return socketObj;
};

export default useDatasetsSockets;
