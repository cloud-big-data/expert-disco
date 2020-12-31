import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { IBoardData, IBoardHead } from 'app/dataset/types';
import { v4 as uuidv4 } from 'uuid';

const getDatasetsWSUrl = (skyvueFileSize: number) => {
  const prefix = skyvueFileSize ? 'xs' : 'xs';
  if (process.env.NODE_ENV === 'production')
    return `https://${prefix}.datasets.skyvueservices.com`;
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
    datasetHead: IBoardHead;
  },
  changeHistoryRef: React.MutableRefObject<Array<string>>,
  setFilesToDownload: (files: string[]) => void,
  loading: boolean,
  setLoading: (isLoading: boolean) => void,
) => {
  const { userId, datasetId } = query;
  const {
    boardData,
    datasetHead,
    setBoardData,
    estCSVSize,
    setEstCSVSize,
    setBoardHead,
  } = board;

  const [socketObj, setSocket] = useState<SocketIOClient.Socket | undefined>(
    undefined,
  );

  const { skyvueFileSize } = datasetHead;

  useEffect(() => {
    if (!userId || !datasetId || !skyvueFileSize || socketObj) return;
    const socket = io(getDatasetsWSUrl(skyvueFileSize), {
      query: {
        datasetId,
        userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => {
      setSocket(socket);
      if (!boardData) {
        socket.emit('loadDataset');
      }
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
        changeHistoryRef.current = [uuidv4()];
      }
    });

    socket.on('slice', (res: IBoardData) => {
      setBoardData(res);
      setLoading(false);
    });

    socket.on('downloadReady', (objectUrls: string[]) => {
      setFilesToDownload(objectUrls);

      setTimeout(() => {
        setFilesToDownload([]);
      }, 5000);
    });

    socket.on('duplicateReady', ({ _id }: { _id: string }) => {
      window.open(`${window.location.host}/dataset/${_id}`);
    });

    window.addEventListener('unload', () => socket.emit('unload'));
    return () => window.removeEventListener('unload', () => socket.emit('unload'));
  }, [
    userId,
    datasetId,
    boardData,
    setBoardData,
    changeHistoryRef,
    estCSVSize,
    setEstCSVSize,
    setBoardHead,
    datasetHead,
    skyvueFileSize,
    socketObj,
    setFilesToDownload,
    loading,
    setLoading,
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
