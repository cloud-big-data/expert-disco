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
    estCSVSize?: number;
    setEstCSVSize?: (head: number) => void;
    boardHead: { rowCount?: number };
    setBoardHead: (head: { rowCount?: number }) => void;
  },
  changeHistoryRef: React.MutableRefObject<Array<IBoardData>>,
) => {
  const { userId, datasetId } = query;
  const { boardData, setBoardData, estCSVSize, setEstCSVSize, setBoardHead } = board;
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
      if (!estCSVSize) {
        socket.emit('csvEstimate');
      }

      socket.emit('meta');
    });

    socket.on('meta', (meta: any) => {
      setBoardHead({
        rowCount: meta.rows,
      });
    });

    socket.on('csvEstimate', (size: number) => {
      setEstCSVSize?.(size);
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

    window.addEventListener('unload', () => socket.emit('unload'));

    return () => {
      ['connect', 'initialDatasetReceived', 'slice', 'returnDiff'].forEach(cnxn =>
        socket.off(cnxn),
      );
    };
  }, [
    userId,
    datasetId,
    boardData,
    setBoardData,
    changeHistoryRef,
    estCSVSize,
    setEstCSVSize,
    setBoardHead,
  ]);

  useEffect(() => {
    window.addEventListener('unload', () => socketObj?.emit('unload'));

    return () => {
      window.removeEventListener('unload', () => socketObj?.emit('unload'));
    };
  }, [socketObj]);

  return socketObj;
};

export default useDatasetsSockets;
