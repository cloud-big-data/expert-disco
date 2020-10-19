import CustomerNav from 'components/nav';
import Loading from 'components/ui/Loading';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { useContext, useEffect, useState } from 'react';
import { DataTypes, IDataset } from '../types';
import DatasetWrapperOwner from './DatasetWrapperOwner';

const sample: IDataset = {
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
      title: {
        label: 'col 1',
        value: 'col_1',
      }
    },
    {
      _id: 'colyoo',
      dataType: DataTypes.string,
      title: {
        label: 'col 2',
        value: 'col_2',
      }
    },
    {
      _id: 'colyooo',
      dataType: DataTypes.string,
      title: {
        label: 'col 3',
        value: 'col_3',
      }
    },
    {
      _id: 'colyoooo',
      dataType: DataTypes.string,
      title: {
        label: 'col 4',
        value: 'col_4',
      }
    },
    {
      _id: 'colyooooo',
      dataType: DataTypes.string,
      title: {
        label: 'col 5',
        value: 'col_5',
      }
    },
    {
      _id: 'colyoooooo',
      dataType: DataTypes.string,
      title: {
        label: 'col 6',
        value: 'col_6',
      }
    }
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
      ]
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
      ]
    },
  ]
}

enum DatasetUserTypes {
  owner,
  editor,
  viewer,
  unauthorized,
}

const getUserType = (
  userId: string,
  visibility: IDataset['visibilitySettings']
): DatasetUserTypes => {
  if (userId === visibility.owner) {
    return DatasetUserTypes.owner
  } else if (visibility.editors.includes(userId)) {
    return DatasetUserTypes.editor;
  } else if (visibility.viewers.includes(userId)) {
    return DatasetUserTypes.viewer;
  } else {
    return DatasetUserTypes.unauthorized;
  }
}

const DatasetWrapper: React.FC = () => {
  const user = useContext(UserContext);
  const [gridData, setGridData] = useState<IDataset | undefined>(undefined);
  
  useEffect(() => {
    setGridData(sample);
  }, [])

  if (!user.userId || !user.email) {
    return (
      <div className="absolute__center">
        <Loading />
      </div>
    )
  }

  if (!gridData) {
    return (
      <React.Fragment>
        <CustomerNav email={user.email} />
        <div className="absolute__center">
          <Loading />
        </div>
      </React.Fragment>
    )
  }

  const userType = getUserType(
    user.userId,
    gridData?.visibilitySettings
  );

  
  return (
    <DatasetContext.Provider value={{
      gridData,
      setGridData:
        [DatasetUserTypes.owner, DatasetUserTypes.editor].includes(userType)
          ? setGridData
          : null
    }}>
      <CustomerNav email={user.email} />
      {userType === DatasetUserTypes.owner && (
        <DatasetWrapperOwner />
      )}
    </DatasetContext.Provider>
  )
}

export default DatasetWrapper;