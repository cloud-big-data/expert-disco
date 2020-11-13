import CustomerNav from 'components/nav';
import Loading from 'components/ui/Loading';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { useContext, useRef, useState } from 'react';
import * as R from 'ramda';
import { useParams } from 'react-router-dom';
import useDatasetsSockets from 'hooks/useDatasetsSockets';
import { useQuery } from 'react-query';
import skyvueFetch from 'services/skyvueFetch';
import { IBoardState, IBoardData } from '../types';
import DatasetWrapperOwner from './DatasetWrapperOwner';

enum DatasetUserTypes {
  owner,
  editor,
  viewer,
  unauthorized,
}

const getUserType = (
  userId: string,
  visibility?: IBoardData['visibilitySettings'],
): DatasetUserTypes => {
  if (!visibility) return DatasetUserTypes.viewer;
  if (userId === visibility.owner) {
    return DatasetUserTypes.owner;
  }
  if (visibility.editors.includes(userId)) {
    return DatasetUserTypes.editor;
  }
  if (visibility.viewers.includes(userId)) {
    return DatasetUserTypes.viewer;
  }
  return DatasetUserTypes.unauthorized;
};

export const initialBoardState = {
  cellsState: {
    activeCell: '',
    selectedCell: '',
    highlightedCells: [],
    copyingCell: '',
  },
  rowsState: {
    selectedRow: '',
    draggedRows: [],
  },
  columnsState: {
    selectedColumn: -1,
    activeColumn: -1,
    draggedColumns: [],
  },
  formulaBar: {
    active: false,
  },
};

const DatasetWrapper: React.FC = () => {
  const user = useContext(UserContext);
  const [boardData, setBoardData] = useState<IBoardData | undefined>(undefined);
  const [boardState, setBoardState] = useState<IBoardState>(initialBoardState);
  const [boardHead, setBoardHead] = useState<{
    rowCount?: number;
  }>({});
  const [estCSVSize, setEstCSVSize] = useState<number | undefined>(undefined);
  const [currentRevision, setCurrentRevision] = useState(0);
  const changeHistoryRef = useRef<IBoardData[]>([]);
  const { datasetId } = useParams<{ datasetId: string }>();

  const { data } = useQuery(user.accessToken, () =>
    user.accessToken
      ? skyvueFetch(user.accessToken).get(`/datasets/${datasetId}`)
      : () => undefined,
  );

  const params = useParams<{
    datasetId: string;
  }>();

  const socket = useDatasetsSockets(
    {
      userId: user.userId,
      datasetId: params.datasetId,
    },
    {
      boardData,
      setBoardData,
      estCSVSize,
      setEstCSVSize,
      boardHead,
      setBoardHead,
    },
    changeHistoryRef,
  );

  const loader = (
    <div className="absolute__center">
      <Loading />
    </div>
  );

  if (!user.userId || !user.email) {
    return loader;
  }

  if (!boardData) {
    return (
      <>
        <CustomerNav email={user.email} />
        {loader}
      </>
    );
  }

  const userType = getUserType(user.userId, boardData.visibilitySettings);

  const _setBoardData = (newBoardData: IBoardData) => {
    setBoardData(prevBoardData => {
      if (!prevBoardData) return newBoardData;
      socket?.emit('diff', {
        colDiff: R.difference(newBoardData.columns, prevBoardData.columns),
        rowDiff: R.difference(newBoardData.rows, prevBoardData.rows),
      });

      return newBoardData;
    });
  };

  const initial_layers = {
    joins: [],
    filters: [],
    groupings: [],
    sortings: [],
    formatting: [],
  };

  return (
    <DatasetContext.Provider
      value={{
        readOnly: !boardData || !R.whereEq(boardData.layers)(initial_layers),
        socket,
        datasetHead: {
          title: data?.dataset?.title,
          createdAt: data?.dataset?.createdAt,
          updatedAt: data?.dataset?.updatedAt,
          skyvueFileSize: data?.head?.ContentLength,
          csvFileSize: estCSVSize,
          rowCount: boardHead.rowCount,
        },
        boardData,
        boardState,
        changeHistoryRef,
        currentRevision,
        getRowSlice: (first: number, last: number) => {
          socket?.emit('getSlice', { first, last });
        },
        redo: () => {
          if (currentRevision === changeHistoryRef.current.length - 1) return;
          const newRevision = currentRevision + 1;
          setBoardData(changeHistoryRef.current[newRevision]);
          setCurrentRevision(newRevision);
        },
        setBoardData: [DatasetUserTypes.owner, DatasetUserTypes.editor].includes(
          userType,
        )
          ? _setBoardData
          : null,
        setBoardState,
        setCurrentRevision,
        undo: () => {
          if (currentRevision === 0) return;
          const prevRevision = currentRevision - 1;
          setBoardData(changeHistoryRef.current[prevRevision]);
          setCurrentRevision(prevRevision);
        },
      }}
    >
      <CustomerNav wide email={user.email} />
      {userType === DatasetUserTypes.owner && <DatasetWrapperOwner />}
    </DatasetContext.Provider>
  );
};

export default DatasetWrapper;
