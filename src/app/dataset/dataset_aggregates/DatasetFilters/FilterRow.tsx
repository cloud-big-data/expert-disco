import {
  IFilterLayer,
  FilterTypes,
  DataTypes,
  LogicalOperators,
  FilterCondition,
} from 'app/dataset/types';
import { IconButton } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import Select from 'components/ui/Select';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import { FilterContext } from './DatasetFilters';

const FilterRowContainer = styled.div<{ parent: boolean; indentation: number }>`
  display: flex;
  flex-direction: column;
  margin-left: ${props => (props.indentation ? props.indentation * 1.75 : 0)}rem;
  .operator__container {
    margin-top: 2rem;
    display: flex;
    align-items: center;
  }
`;

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

// const lensMatching = (pred: any) => (toF: any) => (entities: any) => {
//   const index = R.findIndex(pred, entities);
//   return R.map(entity => R.update(index, entity, entities), toF(entities[index]));
// };

const FilterRow: React.FC<{
  filtersState: IFilterLayer;
  setFiltersState: (state: IFilterLayer) => void;
  path?: number[];
}> = ({ filtersState, setFiltersState, path }) => {
  const { parentFilterState } = useContext(FilterContext);
  const { boardData } = useContext(DatasetContext)!;
  const currentIndentation = useRef(-1);
  const incrementIndentation = (index: number) => {
    currentIndentation.current = index + 1;
  };

  const updateNestedObject = R.curry((key, index, value) =>
    R.assocPath(
      path ? [...path, index, key] : [index, key],
      value,
      parentFilterState,
    ),
  );

  return (
    <>
      {filtersState.map((state, index) => (
        <FilterRowContainer
          parent
          key={
            typeof state !== 'string' && !Array.isArray(state)
              ? state.filterId
              : state.toString()
          }
          indentation={index === 0 ? 0 : currentIndentation.current}
        >
          {typeof state === 'string' ? (
            <div className="operator__container">
              {incrementIndentation(index)}
              <IconButton>
                <i
                  style={{ color: Styles.red, marginRight: '.5rem' }}
                  className="far fa-times"
                />
              </IconButton>
              <Select
                fill={Styles.blue}
                onChange={value =>
                  setFiltersState(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    R.assocPath(
                      path ? [...path, 0] : [index],
                      value,
                      parentFilterState,
                    ),
                  )
                }
                options={[
                  { name: 'and', value: 'AND' },
                  { name: 'or', value: 'OR' },
                ]}
                placeholder="select and/or"
                value={state}
              />
              <IconButton>
                <i
                  style={{ color: Styles.green, marginLeft: '.5rem' }}
                  className="fas fa-plus-square"
                />
              </IconButton>
            </div>
          ) : Array.isArray(state) ? (
            <FilterRow
              setFiltersState={setFiltersState}
              filtersState={state}
              path={path ? [...path, index] : [index]}
            />
          ) : (
            <ConditionContainer>
              <IconButton>
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
                  setFiltersState(updateNestedObject('key', index, value));
                }}
              />
              <div className="select__container">
                <Select
                  fill={Styles.green}
                  options={
                    PREDICATE_OPTIONS[
                      boardData.columns.find(col => col._id === state.key)
                        ?.dataType ?? DataTypes.string
                    ]
                  }
                  onChange={value =>
                    setFiltersState(
                      updateNestedObject('predicateType', index, value),
                    )
                  }
                />
              </div>
              <div className="input__container">
                <InputField
                  unsetHeight
                  type="text"
                  value={state.value as string}
                  onChange={e =>
                    setFiltersState(
                      updateNestedObject('value', index, e.target.value),
                    )
                  }
                />
              </div>

              <IconButton>
                <i
                  style={{ color: Styles.green, marginLeft: '.5rem' }}
                  className="fas fa-plus-square"
                />
              </IconButton>
            </ConditionContainer>
          )}
        </FilterRowContainer>
      ))}
    </>
  );
};

export default FilterRow;
