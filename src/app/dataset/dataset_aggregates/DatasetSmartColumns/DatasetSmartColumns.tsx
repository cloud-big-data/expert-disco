import { Empty, Switch } from 'antd';
import ConfirmationContainer from 'components/ConfirmationButtons';
import SingleSelect from 'components/SingleSelect';
import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';
import EditSmartColumn from './EditSmartColumn';

const SmartColumnsContainer = styled.div<{ selectedSmartColumn: boolean }>`
  .top {
    width: 100%;
    display: flex;
    z-index: 1;
    margin-top: ${props => (props.selectedSmartColumn ? '2rem' : 0)};
    margin-bottom: ${props => (props.selectedSmartColumn ? '-2rem' : 0)};
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

  useEffect(() => {
    if (!R.equals(boardData.layers.smartColumns, smartColumns)) {
      setSmartColumns(boardData.layers.smartColumns);
    }
    // disabling as this effect is just to notify the local state of global changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardData.layers.smartColumns]);

  return (
    <SmartColumnsContainer selectedSmartColumn={!!selectedSmartColumn}>
      {selectedSmartColumn && (
        <ButtonTertiary
          onClick={() => setSelectedSmartColumn(undefined)}
          style={{ padding: '2rem 0 0', marginTop: '-1rem' }}
          iconLeft={<i className="far fa-chevron-left" />}
        >
          Back
        </ButtonTertiary>
      )}
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
            }}
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            setSelectedSmartColumn={setSelectedSmartColumn}
          />
        ) : smartColumns.length > 0 ? (
          <>
            <SingleSelect
              options={smartColumns.map(x => ({
                label: boardData.errors?.some(err => err.target === x._id)
                  ? `${x.value} (has errors)`
                  : x.value ?? '',
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
                    { _id, value: '', expression: '', dataType: 'number' },
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
                  { _id, value: '', expression: '', dataType: 'number' },
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
