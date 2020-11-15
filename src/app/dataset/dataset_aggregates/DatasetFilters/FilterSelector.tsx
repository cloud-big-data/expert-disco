/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DataTypes, IFilterLayer, FilterTypes } from 'app/dataset/types';
import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useState } from 'react';
import Select from 'react-select';
import safeParseNumber from 'utils/safeParseNumber';

type IFilterPredicateOption = {
  label: string;
  value: FilterTypes;
};

const BASE_OPTIONS: IFilterPredicateOption[] = [
  {
    label: 'Equals',
    value: 'equals',
  },
  {
    label: 'Does not equal',
    value: 'notEquals',
  },
];

const PREDICATE_OPTIONS: { [key in DataTypes]: IFilterPredicateOption[] } = {
  [DataTypes.date]: [...BASE_OPTIONS],
  [DataTypes.number]: [...BASE_OPTIONS],
  [DataTypes.string]: [
    ...BASE_OPTIONS,
    {
      label: 'Contains',
      value: 'contains',
    },
  ],
};

const FilterSelector: React.FC<{
  onAddFilter: (filter: IFilterLayer) => void;
}> = ({ onAddFilter }) => {
  const { boardData } = useContext(DatasetContext)!;
  const [columnSelection, setColumnSelection] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [predicateOption, setPredicateOption] = useState<
    IFilterPredicateOption | undefined
  >(undefined);
  const [comparison, setComparison] = useState('');

  const predicateTypeOptions = columnSelection
    ? PREDICATE_OPTIONS[
        boardData.columns.find(col => col._id === columnSelection.value)!.dataType
      ]
    : [];

  return (
    <>
      {/* <Select
        options={boardData.columns.map(col => ({
          label: col.value,
          value: col._id,
        }))}
        value={columnSelection}
        onChange={e =>
          setColumnSelection({
            // @ts-ignore
            label: e.label,
            // @ts-ignore
            value: e.value,
          })
        }
      />
      <br />
      {columnSelection && (
        <Select
          onChange={e =>
            setPredicateOption({
              // @ts-ignore
              label: e.label,
              // @ts-ignore
              value: e.value,
            })
          }
          options={predicateTypeOptions}
        />
      )}
      <br />
      {predicateOption && (
        <InputField
          placeholder="Condition"
          value={comparison}
          onChange={e => setComparison(e.target.value)}
        />
      )}
      <br />
      {columnSelection && predicateOption && comparison !== '' && (
        <ButtonPrimary
          onClick={() => {
            onAddFilter({
              key: columnSelection.value,
              predicateType: predicateOption?.value,
              value: safeParseNumber(comparison),
            });
          }}
        >
          Add filter
        </ButtonPrimary>
      )} */}
    </>
  );
};

export default FilterSelector;
