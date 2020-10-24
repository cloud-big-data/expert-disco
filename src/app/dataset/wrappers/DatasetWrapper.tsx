import CustomerNav from 'components/nav';
import Loading from 'components/ui/Loading';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';
import { DataTypes, IBoardState, IBoardData, IChangeHistory } from '../types';
import DatasetWrapperOwner from './DatasetWrapperOwner';

const sample: IBoardData = {
  updatedAt: '2020-10-16T03:21:24+00:00',
  createdAt: '2020-10-16T03:21:24+00:00',
  title: 'my first dataset',
  visibilitySettings: {
    owner: '5f83b906bb51d45cdfb5430e',
    editors: ['5f83b906bb51d45cdfb5430e'],
    viewers: [],
  },
  columns: [
    {
      _id: 'colyo',
      dataType: DataTypes.string,
      value: 'col 1',
    },
    {
      _id: 'colyoo',
      dataType: DataTypes.string,
      value: 'col 2',
    },
    {
      _id: 'colyooo',
      dataType: DataTypes.string,
      value: 'col 3',
    },
    {
      _id: 'colyoooo',
      dataType: DataTypes.string,
      value: 'col 4',
    },
    {
      _id: 'colyooooo',
      dataType: DataTypes.string,
      value: 'col 5',
    },
    {
      _id: 'colyoooooo',
      dataType: DataTypes.string,
      value: 'col 6',
    },
  ],
  rows: [
    {
      _id: 'blah',
      cells: [
        {
          _id: 'yo10',
          value: 'hi',
        },
        {
          _id: 'yo11',
          value: 'hi',
        },
        {
          _id: 'yo12',
          value: 'hi',
        },
        {
          _id: 'yo13',
          value: 'hi',
        },
        {
          _id: 'yo14',
          value: 'hi',
        },
        {
          _id: 'yo15',
          value: 'hi',
        },
      ],
    },
    {
      _id: 'blahh',
      cells: [
        {
          _id: 'yoo23',
          value: 'yo',
        },
        {
          _id: 'yoo235',
          value: 'yo',
        },
        {
          _id: 'yoo436',
          value: 'yo',
        },
        {
          _id: 'yoo435',
          value: 'yo',
        },
        {
          _id: 'yoo2145',
          value: 'yo',
        },
        {
          _id: 'yo12345o',
          value: 'yo',
        },
      ],
    },
  ],
};

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
  const changeHistoryRef = useRef<IChangeHistory[]>([]);
  const currentRevision = useRef<string | undefined>(undefined);

  useEffect(() => {
    setBoardData(sample);
    currentRevision.current = uuidv4();
  }, []);

  if (!user.userId || !user.email) {
    return (
      <div className="absolute__center">
        <Loading />
      </div>
    );
  }

  if (!boardData) {
    return (
      <>
        <CustomerNav email={user.email} />
        <div className="absolute__center">
          <Loading />
        </div>
      </>
    );
  }

  const userType = getUserType(user.userId, boardData?.visibilitySettings);

  return (
    <DatasetContext.Provider
      value={{
        currentRevision,
        boardData,
        setBoardData: [DatasetUserTypes.owner, DatasetUserTypes.editor].includes(
          userType,
        )
          ? (boardData: IBoardData) => {
              changeHistoryRef.current = [
                ...R.uniqBy(R.prop('revisionId'), changeHistoryRef.current),
                {
                  ...boardData,
                  revisionId: uuidv4(),
                },
              ];
              setBoardData(boardData);
            }
          : null,
        boardState,
        setBoardState,
        changeHistoryRef,
      }}
    >
      <CustomerNav wide email={user.email} />
      {userType === DatasetUserTypes.owner && <DatasetWrapperOwner />}
    </DatasetContext.Provider>
  );
};

export default DatasetWrapper;
