import CustomerNav from 'components/nav';
import Loading from 'components/ui/Loading';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { useContext, useRef, useState } from 'react';
import * as R from 'ramda';
import { useParams } from 'react-router-dom';
import useDatasetsSockets from 'hooks/useDatasetsSockets';
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
  visibility: IBoardData['visibilitySettings'],
): DatasetUserTypes => {
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
  const [currentRevision, setCurrentRevision] = useState(0);
  const changeHistoryRef = useRef<IBoardData[]>([]);
  const params = useParams<{
    datasetId: string;
  }>();

  useDatasetsSockets(
    {
      userId: user.userId,
      datasetId: params.datasetId,
    },
    {
      boardData,
      setBoardData,
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

  const userType = getUserType(user.userId, boardData?.visibilitySettings);
  const saveToChangeHistory = () => {
    changeHistoryRef.current = [
      ...R.uniqBy(R.prop('rows'), changeHistoryRef.current),
      boardData,
    ];
  };

  return (
    <DatasetContext.Provider
      value={{
        currentRevision,
        setCurrentRevision,
        boardData,
        setBoardData: [DatasetUserTypes.owner, DatasetUserTypes.editor].includes(
          userType,
        )
          ? setBoardData
          : null,
        boardState,
        setBoardState: (boardState: IBoardState) =>
          setBoardState(prevBoardState => {
            if (
              prevBoardState.cellsState.activeCell !== '' &&
              boardState.cellsState.activeCell === '' &&
              prevBoardState.cellsState.selectedCell !== '' &&
              boardState.cellsState.selectedCell !== ''
            ) {
              saveToChangeHistory();
              setCurrentRevision(currentRevision + 1);
            }

            return boardState;
          }),
        changeHistoryRef,
        undo: () => {
          if (currentRevision === 0) return;
          const prevRevision = currentRevision - 1;
          setBoardData(changeHistoryRef.current[prevRevision]);
          setCurrentRevision(prevRevision);
        },
        redo: () => {
          if (currentRevision === changeHistoryRef.current.length - 1) return;
          const newRevision = currentRevision + 1;
          setBoardData(changeHistoryRef.current[newRevision]);
          setCurrentRevision(newRevision);
        },
      }}
    >
      <CustomerNav wide email={user.email} />
      {userType === DatasetUserTypes.owner && <DatasetWrapperOwner />}
    </DatasetContext.Provider>
  );
};

export default DatasetWrapper;
