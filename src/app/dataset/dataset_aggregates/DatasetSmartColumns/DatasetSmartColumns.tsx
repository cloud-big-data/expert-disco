import { Empty, Switch } from 'antd';
import ConfirmationContainer from 'components/ConfirmationButtons';
import SingleSelect from 'components/SingleSelect';
import { ButtonPrimary } from 'components/ui/Buttons';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import EditSmartColumn from './EditSmartColumn';

const SmartColumnsContainer = styled.div`
  .top {
    width: 100%;
    display: flex;
    z-index: 1;
    align-items: center;
    button {
      margin-left: auto;
      padding: 0;
      margin-bottom: 1.375rem;
    }

    .right {
      margin-left: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
`;

const DatasetSmartColumns: React.FC = () => {
  const { boardData, setBoardData, socket } = useContext(DatasetContext)!;
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [selectedSmartColumn, setSelectedSmartColumn] = useState<
    string | undefined
  >();
  const [smartColumns, setSmartColumns] = useState(boardData.layers.smartColumns);

  return (
    <SmartColumnsContainer>
      <div className="top">
        <h6>Smart Columns</h6>
        <div className="right">
          <Label>Apply layer</Label>
          <Switch
            onChange={e => {
              setBoardData?.({
                ...boardData,
                layerToggles: {
                  ...boardData.layerToggles,
                  filters: e,
                },
              });
              socket?.emit('toggleLayer', {
                toggle: 'smartColumns',
                visible: e,
              });
            }}
            checked={boardData.layerToggles.smartColumns}
          />
        </div>
      </div>
      <div className="main">
        {selectedSmartColumn ? (
          <EditSmartColumn
            smartColumns={smartColumns}
            setSmartColumns={setSmartColumns}
            columnId={selectedSmartColumn}
            saveSmartColumn={col => {
              const updatedSmartColumns = smartColumns.find(
                col_ => col_._id === col._id,
              )
                ? smartColumns.map(col_ => (col_._id === col._id ? col : col_))
                : [...smartColumns, col];

              setSmartColumns(updatedSmartColumns);
              socket?.emit('layer', {
                layerKey: 'smartColumns',
                layerData: updatedSmartColumns,
              });
              console.log(updatedSmartColumns);
            }}
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            setSelectedSmartColumn={setSelectedSmartColumn}
          />
        ) : smartColumns.length > 0 ? (
          <>
            <SingleSelect
              options={smartColumns.map(x => ({
                label: x.columnName,
                value: x._id,
              }))}
              onSelect={setSelectedSmartColumn}
              selected={selectedSmartColumn}
            />
            <ConfirmationContainer>
              <ButtonPrimary
                iconRight={
                  <i style={{ color: 'white' }} className="far fa-plus-circle" />
                }
                onClick={() => {
                  const _id = uuidv4();
                  setSmartColumns([
                    ...smartColumns,
                    { _id, columnName: '', expression: '' },
                  ]);
                  setSelectedSmartColumn(_id);
                  setUnsavedChanges(true);
                }}
              >
                Add a new column
              </ButtonPrimary>
            </ConfirmationContainer>
          </>
        ) : (
          <Empty
            description={<span>Add smart columns blah blah</span>}
            style={{ textAlign: 'center' }}
          >
            <ButtonPrimary
              onClick={() => {
                const _id = uuidv4();
                setSmartColumns([
                  ...smartColumns,
                  { _id, columnName: '', expression: '' },
                ]);
                setSelectedSmartColumn(_id);
                setUnsavedChanges(true);
              }}
              style={{
                margin: '0 auto',
              }}
            >
              Add a smart column
            </ButtonPrimary>
          </Empty>
        )}
      </div>
    </SmartColumnsContainer>
  );
};

export default DatasetSmartColumns;
