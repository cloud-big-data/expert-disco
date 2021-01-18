import { IBoardData, ISmartColumn } from 'app/dataset/types';
import ConfirmationContainer from 'components/ConfirmationButtons';
import Separator from 'components/Separator';
import { ButtonDanger, ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import WarningBlock from 'components/WarningBlock';
import { UUID_REGEX } from 'app/dataset/constants';
import findColumnById from 'app/dataset/lib/findColumnById';
import ExpressionEditor from './ExpressionEditor';

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

const replaceColIdsWithValues = (expression: string, boardData: IBoardData) =>
  expression.replace(
    UUID_REGEX,
    _id => `[${findColumnById(_id, boardData)?.value ?? ''}]`,
  );

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
  const { socket, boardData } = useContext(DatasetContext)!;
  const [showDeleteConf, setShowDeleteConf] = useState(false);
  const column = smartColumns.find(x => x._id === columnId);
  const [expression, setExpression] = useState(column?.expression);
  const [columnName, setColumnName] = useState(column?.value);

  const [expressionIsFocused, setExpressionIsFocused] = useState(false);

  const expressionRef = useRef<HTMLInputElement>(null);

  const error = boardData.errors?.find(err => err.target === columnId);
  const errorMessage =
    error !== undefined
      ? `There was an error in your formula: ${error.message.toString()}`
      : undefined;

  useEffect(() => {
    const ref = expressionRef.current;
    if (!ref) return;

    const handleFocus = () => {
      setExpressionIsFocused(true);
    };
    const handleBlur = () => {
      setExpressionIsFocused(false);
    };

    ref.addEventListener('focus', handleFocus);
    ref.addEventListener('blur', handleBlur);

    return () => {
      ref.removeEventListener('focus', handleFocus);
      ref.removeEventListener('blur', handleBlur);
    };
  }, []);

  console.log(columnId);

  return (
    <EditingContainer>
      <Label>Editing: {column?.value}</Label>
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
      <ExpressionEditor
        expressionRef={expressionRef}
        validationError={errorMessage}
        expression={
          expressionIsFocused
            ? expression
            : replaceColIdsWithValues(expression ?? '', boardData)
        }
        setExpression={setExpression}
        setUnsavedChanges={setUnsavedChanges}
      />
      <Separator />
      {!showDeleteConf && (
        <>
          <ConfirmationContainer>
            <ButtonTertiary
              onClick={() => {
                setUnsavedChanges(false);
                setSelectedSmartColumn();
              }}
            >
              Cancel
            </ButtonTertiary>
            <ButtonPrimary
              disabled={!expression || !columnName || !unsavedChanges}
              onClick={() => {
                if (!expression || !columnName) return;
                setUnsavedChanges(false);
                saveSmartColumn({
                  _id: columnId,
                  dataType: column?.dataType ?? 'number',
                  expression,
                  value: columnName,
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
