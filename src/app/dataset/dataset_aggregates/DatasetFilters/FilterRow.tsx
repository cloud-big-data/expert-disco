import { IFilterLayer } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import { FilterContext } from './DatasetFilters';
import Condition from './Condition';
import Operator from './Operator';

const FilterRowContainer = styled.div<{ parent: boolean; indentation: number }>`
  display: flex;
  flex-direction: column;
  margin-left: ${props => (props.indentation ? props.indentation * 1.75 : 0)}rem;
`;

const OperatorBreak = styled.button`
  color: ${Styles.softGray};
  font-weight: bold;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  margin-top: 1rem;
  padding: 0;
  display: flex;
  font-size: 0.8rem;
  max-width: 5rem;
  &:hover {
    color: ${Styles.fontColor};
  }
`;

const FilterRow: React.FC<{
  parent?: boolean;
  filtersState: IFilterLayer;
  setFiltersState: (state: IFilterLayer) => void;
  path?: number[];
}> = ({ parent, filtersState, setFiltersState, path }) => {
  const { parentFilterState } = useContext(FilterContext)!;
  const { boardData } = useContext(DatasetContext)!;
  const currentIndentation = { current: -1 };
  const incrementIndentation = (index: number) => {
    currentIndentation.current = index + 1;
  };

  const sortState = R.sortBy(x => Array.isArray(x));
  const updateNestedObject = R.curry((index, key, value) =>
    R.assocPath(
      path ? [...path, index, key] : [index, key],
      value,
      sortState(parentFilterState!),
    ),
  );

  const sortedFiltersState = sortState(filtersState);

  const addOperator = (index: number) => {
    const path_ = path ? [...path, index] : [index];
    setFiltersState(
      R.over(
        R.lensPath(path_.slice(0, path_.length - 1)),
        R.append([
          'AND',
          {
            filterId: uuidv4(),
            key: boardData.columns[0]._id,
            predicateType: 'equals',
            value: '',
          },
        ]),
        parentFilterState!,
      ),
    );
  };

  return (
    <>
      {sortedFiltersState.map((state, index) => (
        <FilterRowContainer
          parent
          key={
            typeof state !== 'string' && !Array.isArray(state)
              ? state.filterId
              : state.toString() + index
          }
          indentation={index === 0 ? 0 : currentIndentation.current}
        >
          {typeof state === 'string' ? (
            <>
              {incrementIndentation(index)}
              <Operator
                index={index}
                incrementIndentation={incrementIndentation}
                parent={parent}
                state={state}
                parentFilterState={parentFilterState!}
                setFiltersState={setFiltersState}
                path={path ? [...path, index] : [index]}
              />
            </>
          ) : Array.isArray(state) ? (
            <FilterRow
              setFiltersState={setFiltersState}
              filtersState={state}
              path={path ? [...path, index] : [index]}
            />
          ) : (
            <>
              <Condition
                state={state}
                setFiltersState={setFiltersState}
                updateNestedObject={updateNestedObject(index)}
                boardData={boardData}
                path={path ? [...path, index] : [index]}
              />
              {(Array.isArray(sortedFiltersState[index + 1]) ||
                index === sortedFiltersState.length - 1) && (
                <OperatorBreak onClick={() => addOperator(index)}>
                  + and/or
                </OperatorBreak>
              )}
            </>
          )}
        </FilterRowContainer>
      ))}
    </>
  );
};

export default FilterRow;
