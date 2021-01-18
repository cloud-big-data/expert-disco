import { ISmartColumn } from 'app/dataset/types';
import ConfirmationContainer from 'components/ConfirmationButtons';
import Separator from 'components/Separator';
import { ButtonDanger, ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import WarningBlock from 'components/WarningBlock';

const EditingContainer = styled.div`
  display: flex;
  flex-direction: column;
  .confirmationContainer {
    display: flex;
    justify-content: center;
  }
  @media (min-width: 900px) {
    #columnName {
      width: 50%;
    }
  }
`;

const EditSmartColumn: React.FC<{
  smartColumns: ISmartColumn[];
  setSmartColumns: (columns: ISmartColumn[]) => void;
  columnId: string;
  saveSmartColumn: (smartColumn: ISmartColumn) => void;
  unsavedChanges: boolean;
  setUnsavedChanges: (changes: boolean) => void;
  setSelectedSmartColumn: (selected?: string) => void;
}> = ({
  smartColumns,
  setSmartColumns,
  columnId,
  saveSmartColumn,
  unsavedChanges,
  setUnsavedChanges,
  setSelectedSmartColumn,
}) => {
  const { socket } = useContext(DatasetContext)!;
  const [showDeleteConf, setShowDeleteConf] = useState(false);
  const column = smartColumns.find(x => x._id === columnId);
  const [expression, setExpression] = useState(column?.expression);
  const [columnName, setColumnName] = useState(column?.columnName);

  return (
    <EditingContainer>
      <Label>Editing: {column?.columnName}</Label>
      <InputField
        id="columnName"
        name="columnName"
        label="Column name"
        value={columnName}
        onChange={e => {
          setUnsavedChanges(true);
          setColumnName(e.target.value);
        }}
      />
      <InputField
        name="expression"
        label="Expression"
        icon={<i className="fad fa-function" />}
        value={expression}
        onChange={e => {
          setUnsavedChanges(true);
          setExpression(e.target.value);
        }}
      />

      <Separator />
      {!showDeleteConf && (
        <>
          <ConfirmationContainer>
            <ButtonTertiary
              onClick={() => {
                setUnsavedChanges(false);
                setSelectedSmartColumn();
                setSmartColumns(smartColumns.filter(col => col._id !== columnId));
              }}
            >
              Cancel
            </ButtonTertiary>
            <ButtonPrimary
              disabled={!expression || !columnName || !unsavedChanges}
              onClick={() => {
                if (!expression || !columnName) return;
                setUnsavedChanges(false);
                setSelectedSmartColumn();
                saveSmartColumn({
                  _id: columnId,
                  expression,
                  columnName,
                });
              }}
            >
              Save
            </ButtonPrimary>
          </ConfirmationContainer>
          <Separator />
        </>
      )}
      {showDeleteConf ? (
        <WarningBlock
          actions={
            <ConfirmationContainer>
              <ButtonTertiary onClick={() => setShowDeleteConf(false)}>
                Cancel
              </ButtonTertiary>
              <ButtonDanger
                onClick={() => {
                  const updated = smartColumns.filter(x => x._id !== columnId);
                  socket?.emit('layer', {
                    layerKey: 'smartColumns',
                    layerData: updated,
                  });
                  setSmartColumns(updated);
                  setSelectedSmartColumn();
                }}
              >
                Delete
              </ButtonDanger>
            </ConfirmationContainer>
          }
        >
          Are you sure that you want to delete this column?
        </WarningBlock>
      ) : (
        <ConfirmationContainer>
          <ButtonDanger onClick={() => setShowDeleteConf(true)}>
            Delete Column
          </ButtonDanger>
        </ConfirmationContainer>
      )}
    </EditingContainer>
  );
};

export default EditSmartColumn;
