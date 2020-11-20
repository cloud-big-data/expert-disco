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
  { name: 'equals', value: 'equals' },
  { name: 'does not equal', value: 'notEquals' },
];

const PREDICATE_OPTIONS: { [key in DataTypes]: IFilterPredicateOption[] } = {
  [DataTypes.date]: [
    ...BASE_OPTIONS,

    { name: 'is less than', value: 'lessThan' },
    { name: 'is less than or equal to', value: 'lessThanEqualTo' },
    { name: 'is greater than', value: 'greaterThan' },
    {
      name: 'is greater than or equal to',
      value: 'greaterThanEqualTo',
    },
    { name: 'is between (date)', value: 'dateBetween' },
  ],
  [DataTypes.number]: [
    ...BASE_OPTIONS,
    { name: 'is less than', value: 'lessThan' },
    { name: 'is less than or equal to', value: 'lessThanEqualTo' },
    { name: 'is greater than', value: 'greaterThan' },
    {
      name: 'is greater than or equal to',
      value: 'greaterThanEqualTo',
    },
  ],
  [DataTypes.string]: [...BASE_OPTIONS, { name: 'contains', value: 'contains' }],
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
              style={{ color: Styles.red, marginRight: '.5rem' }}
              className="far fa-times"
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
              fill={Styles.green}
              options={
                PREDICATE_OPTIONS[
                  boardData.columns.find(col => col._id === state.key)?.dataType ??
                    DataTypes.string
                ]
              }
              onChange={value =>
                setFiltersState(updateNestedObject('predicateType', value))
              }
            />
          </div>
          <div className="input__container">
            <InputField
              unsetHeight
              type="text"
              value={state.value as string}
              onChange={e =>
                setFiltersState(updateNestedObject('value', e.target.value))
              }
            />
          </div>
        </>
      )}
    </ConditionContainer>
  );
};

export default Condition;
