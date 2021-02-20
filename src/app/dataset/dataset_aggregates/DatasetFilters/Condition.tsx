import {
  DataTypes,
  FilterCondition,
  IBoardData,
  IFilterLayer,
  FilterTypes,
} from 'app/dataset/types';
import { ButtonDanger, ButtonTertiary, IconButton } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import Select from 'components/ui/Select';
import { Text } from 'components/ui/Typography';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import DatePicker from 'components/ui/DatePicker';
import { FilterContext } from './DatasetFilters';

const ConditionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;

  .select__container,
  .input__container {
    margin-left: 1rem;
  }
`;

type IFilterPredicateOption = {
  name: string;
  value: FilterTypes;
};

const BASE_OPTIONS: IFilterPredicateOption[] = [
  { name: 'Is not null', value: 'notNull' },
  { name: 'Is null', value: 'null' },
  { name: 'equals', value: 'equals' },
  { name: 'does not equal', value: 'notEquals' },
];

const PREDICATE_OPTIONS: { [key in DataTypes]: IFilterPredicateOption[] } = {
  date: [
    { name: 'equals', value: 'equals_date' },
    { name: 'does not equal', value: 'notEquals_date' },
    { name: 'same day', value: 'sameDay' },
    { name: 'same week', value: 'sameWeek' },
    { name: 'same month', value: 'sameMonth' },
    { name: 'same year', value: 'sameYear' },
    { name: 'is before', value: 'lessThan_date' },
    { name: 'is before or equal to', value: 'lessThanEqualTo_date' },
    { name: 'is after', value: 'greaterThan_date' },
    {
      name: 'is after or equal to',
      value: 'greaterThanEqualTo_date',
    },
    { name: 'is between', value: 'dateBetween' },
  ],
  number: [
    ...BASE_OPTIONS,
    { name: 'is less than', value: 'lessThan' },
    { name: 'is less than or equal to', value: 'lessThanEqualTo' },
    { name: 'is greater than', value: 'greaterThan' },
    {
      name: 'is greater than or equal to',
      value: 'greaterThanEqualTo',
    },
  ],
  string: [...BASE_OPTIONS, { name: 'contains', value: 'contains' }],
};

const DeleteConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 50%;
  .buttons {
    display: flex;
    align-items: center;
    button:last-of-type {
      margin-left: 1rem;
    }
  }
`;

const Condition: React.FC<{
  state: FilterCondition;
  setFiltersState: (filtersState: IFilterLayer) => void;
  updateNestedObject: (key: any, value: any) => IFilterLayer;
  boardData: IBoardData;
  path: number[];
}> = ({ state, setFiltersState, updateNestedObject, boardData, path }) => {
  const { parentFilterState } = useContext(FilterContext);
  const [showDeleteConf, setShowDeleteConf] = useState(false);
  const dataType =
    boardData.columns.find(col => col._id === state.key)?.dataType ?? 'string';
  return (
    <ConditionContainer>
      {showDeleteConf ? (
        <DeleteConfirmationContainer>
          <h6 style={{ marginBottom: 0 }}>
            Are you sure you want to delete this rule?
          </h6>
          <Text size="lg" len="short">
            This action cannot be undone.
          </Text>
          <div className="buttons">
            <ButtonTertiary onClick={() => setShowDeleteConf(false)}>
              Cancel
            </ButtonTertiary>
            <ButtonDanger
              onClick={() => {
                setFiltersState(R.dissocPath(path, parentFilterState));
              }}
            >
              Confirm
            </ButtonDanger>
          </div>
        </DeleteConfirmationContainer>
      ) : (
        <>
          <IconButton onClick={() => setShowDeleteConf(true)}>
            <i
              style={{ color: Styles.red400, marginRight: '.5rem' }}
              className="far fa-times-circle"
            />
          </IconButton>
          <Select
            options={boardData.columns.map(col => ({
              name: col.value as string,
              value: col._id,
            }))}
            value={state.key}
            onChange={value => {
              setFiltersState(updateNestedObject('key', value));
            }}
          />
          <div className="select__container">
            <Select
              options={PREDICATE_OPTIONS[dataType]}
              value={state.predicateType}
              onChange={value =>
                setFiltersState(updateNestedObject('predicateType', value))
              }
            />
          </div>
          <div className="input__container">
            {!['null', 'notNull'].includes(state.predicateType) &&
              (dataType === 'date' ? (
                <DatePicker
                  format="MM-DD-YYYY"
                  onChange={(_, dateString) => {
                    console.log(dateString);
                    setFiltersState(updateNestedObject('value', dateString));
                  }}
                  value={state.value ? new Date(state.value as number) : undefined}
                />
              ) : (
                <InputField
                  unsetHeight
                  type="text"
                  value={state.value as string}
                  onChange={e =>
                    setFiltersState(updateNestedObject('value', e.target.value))
                  }
                />
              ))}
          </div>
        </>
      )}
    </ConditionContainer>
  );
};

export default Condition;
