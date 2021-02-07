import { UUID_REGEX, UUID_REGEX_W_COL_PREFIX } from 'app/dataset/constants';
import InputField from 'components/ui/InputField';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useState } from 'react';
import * as R from 'ramda';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import { DataTypes } from 'app/dataset/types';
import findColumnById from 'app/dataset/lib/findColumnById';

const ExpressionEditor: React.FC<{
  expression?: string;
  dataType?: DataTypes;
  setDataType: (type: DataTypes) => void;
  setUnsavedChanges: (changes: boolean) => void;
  setExpression: (exp: string) => void;
  validationError?: string;
  expressionRef: React.RefObject<HTMLInputElement>;
  columnId?: string;
}> = ({
  dataType,
  setDataType,
  expression,
  setUnsavedChanges,
  setExpression,
  validationError,
  expressionRef,
  columnId,
}) => {
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const { boardData } = useContext(DatasetContext)!;
  const { columns } = boardData;

  useHandleClickOutside(expressionRef, () => setAutoCompleteOpen(false));

  useEffect(() => {
    const ref = expressionRef.current;
    const handleCaret = (e: KeyboardEvent) => {
      e.preventDefault();
      const start = ref?.selectionStart;
      const end = ref?.selectionEnd;
      if (!start || !end || start === 0 || !ref) return;
      const activeInput = expression?.split('') ?? [];

      const groupText = (stepsBehind: number) =>
        activeInput.slice(start - stepsBehind, start).join('');

      if (
        groupText('col('.length).toUpperCase() === 'COL(' ||
        groupText('CONCATENATE('.length).toUpperCase() === 'CONCATENATE('
      ) {
        setAutoCompleteOpen(true);
      } else {
        setAutoCompleteOpen(false);
      }

      if (
        groupText('CONCATENATE('.length).toUpperCase() === 'CONCATENATE(' &&
        dataType !== 'string'
      ) {
        setDataType('string');
      }
    };

    ref?.addEventListener('keyup', handleCaret);

    return () => ref?.removeEventListener('keyup', handleCaret);
  }, [dataType, expression, expressionRef, setDataType]);

  return (
    <InputField
      inputRef={expressionRef}
      options={columns
        .filter(col => col._id !== columnId)
        .map(col => ({
          label: col.value,
          value: col._id,
        }))}
      placeholder="Formula"
      setValue={value => {
        const expressionArr = expression?.split('');
        const cursorPosition = expressionRef.current?.selectionStart;
        if (!expressionArr || !cursorPosition) return;
        setExpression(
          R.insert(cursorPosition, value, expressionArr)
            .join('')
            .replace(UUID_REGEX_W_COL_PREFIX, e => {
              const colId = e.match(UUID_REGEX)?.[0] ?? e;
              const column = findColumnById(colId, boardData);
              return column?.dataType === 'string' ? `"${colId}"` : colId;
            }),
        );
      }}
      dropdownOpen={autoCompleteOpen}
      spellCheck={false}
      name="expression"
      label="Expression"
      icon={<i className="fad fa-function" />}
      value={expression ?? ''}
      onChange={e => {
        setUnsavedChanges(true);
        setExpression(e.target.value);
      }}
      validationError={validationError}
    />
  );
};

export default ExpressionEditor;
