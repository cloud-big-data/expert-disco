import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BoardError, IBoardData, IBoardHead, IBoardState } from 'app/dataset/types';
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
    boardState: IBoardState;
    setBoardState: (state: IBoardState) => void;
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
  },
  changeHistoryRef: React.MutableRefObject<Array<string>>,
  setFilesToDownload: (files: string[]) => void,
  loading: boolean,
  setLoading: (isLoading: boolean) => void,
): { socket: SocketIOClient.Socket | undefined; socketLoading: boolean } => {
  const { userId, datasetId } = query;
  const {
    boardData,
    datasetHead,
    setBoardData,
    estCSVSize,
    setEstCSVSize,
    setBoardHead,
    boardState,
    setBoardState,
    queriedDatasets,
    setQueriedDatasets,
  } = board;

  const [socketObj, setSocket] = useState<SocketIOClient.Socket | undefined>(
    undefined,
  );
  const [socketLoading, setSocketLoading] = useState(true);

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
    setSocket(socket);
    setSocketLoading(false);

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
        if (!changeHistoryRef.current?.[0]) {
          changeHistoryRef.current = [uuidv4()];
        }

        localStorage.setItem(
          `${datasetId}-change-history`,
          JSON.stringify(changeHistoryRef.current),
        );
      }
    });

    socket.on(
      'returnQueryBoardHeaders',
      (
        res: Pick<IBoardData, 'columns' | 'visibilitySettings' | 'layers' | '_id'>,
      ) => {
        setQueriedDatasets(
          queriedDatasets.find(
            dataset => dataset.columns.length === res.columns.length,
          )
            ? queriedDatasets.map(dataset =>
                dataset.columns.length === res.columns.length ? res : dataset,
              )
            : [...queriedDatasets, res],
        );
      },
    );

    socket.on('slice', (res: IBoardData) => {
      setBoardData(res);
      if (loading) {
        setLoading(false);
      }
    });

    socket.on('downloadReady', (objectUrls: string[]) => {
      setFilesToDownload(objectUrls);

      setTimeout(() => {
        setFilesToDownload([]);
      }, 5000);
    });

    socket.on('clearErrors', () => {
      if (!boardData) return;
      setBoardData?.({
        ...boardData,
        errors: [],
      });
    });

    socket.on('boardError', (err: BoardError) => {
      if (!boardData) return;
      setBoardData?.({
        ...boardData,
        errors: [...(boardData.errors ?? []), err],
      });
    });

    socket.on('duplicateReady', ({ _id }: { _id: string }) => {
      window.open(`${window.location.host}/dataset/${_id}`);
    });

    window.addEventListener('unload', () => socket.emit('unload'));
    return () => {
      window.removeEventListener('unload', () => socket.emit('unload'));
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
    datasetHead,
    skyvueFileSize,
    socketObj,
    setFilesToDownload,
    loading,
    setLoading,
    boardState,
    setBoardState,
    setQueriedDatasets,
    queriedDatasets,
  ]);

  useEffect(() => {
    window.addEventListener('unload', () => socketObj?.emit('unload'));

    return () => {
      window.removeEventListener('unload', () => socketObj?.emit('unload'));
    };
  }, [socketObj]);

  return {
    socket: socketObj,
    socketLoading,
  };
};

export default useDatasetsSockets;
