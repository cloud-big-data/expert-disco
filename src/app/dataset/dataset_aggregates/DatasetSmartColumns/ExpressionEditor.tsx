import { UUID_REGEX, UUID_REGEX_W_COL_PREFIX } from 'app/dataset/constants';
import InputField from 'components/ui/InputField';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import * as R from 'ramda';
import useHandleClickOutside from 'hooks/useHandleClickOutside';

const ExpressionEditor: React.FC<{
  expression?: string;
  setUnsavedChanges: (changes: boolean) => void;
  setExpression: (exp: string) => void;
}> = ({ expression, setUnsavedChanges, setExpression }) => {
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const { boardData } = useContext(DatasetContext)!;
  const { columns } = boardData;
  const inputRef = useRef<HTMLInputElement>(null);

  useHandleClickOutside(inputRef, () => setAutoCompleteOpen(false));

  useEffect(() => {
    const ref = inputRef.current;
    const handleCaret = (e: KeyboardEvent) => {
      e.preventDefault();
      const start = ref?.selectionStart;
      const end = ref?.selectionEnd;
      if (!start || !end || start === 0 || !ref) return;
      const activeInput = expression?.split('') ?? [];

      const groupText = (stepsBehind: number) =>
        activeInput.slice(start - stepsBehind, start).join('');

      if (
        groupText('col('.length) === 'col(' ||
        groupText('CONCATENATE('.length) === 'CONCATENATE('
      ) {
        setAutoCompleteOpen(true);
      } else {
        setAutoCompleteOpen(false);
      }
    };

    ref?.addEventListener('keyup', handleCaret);

    return () => ref?.removeEventListener('keyup', handleCaret);
  }, [expression]);

  return (
    <InputField
      inputRef={inputRef}
      options={columns.map(col => ({
        label: col.value,
        value: col._id,
      }))}
      setValue={value => {
        const expressionArr = expression?.split('');
        const cursorPosition = inputRef.current?.selectionStart;
        if (!expressionArr || !cursorPosition) return;
        setExpression(
          R.insert(cursorPosition, value, expressionArr)
            .join('')
            .replace(UUID_REGEX_W_COL_PREFIX, e => e.match(UUID_REGEX)?.[0] ?? e),
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
    />
  );
};

export default ExpressionEditor;
