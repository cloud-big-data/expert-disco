import { IFilterLayer } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
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
  const { parentFilterState } = useContext(FilterContext);
  const { boardData } = useContext(DatasetContext)!;
  const currentIndentation = useRef(-1);
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

  const sortedFilterState = sortState(filtersState);

  return (
    <>
      {sortedFilterState.map((state, index) => (
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
            <Operator
              index={index}
              incrementIndentation={incrementIndentation}
              parent={parent}
              state={state}
              setFiltersState={setFiltersState}
            />
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
              />
              {(Array.isArray(sortedFilterState[index + 1]) ||
                index === sortedFilterState.length - 1) && (
                <OperatorBreak onClick={() => alert('hi')}>+ and/or</OperatorBreak>
              )}
            </>
          )}
        </FilterRowContainer>
      ))}
    </>
  );
};

export default FilterRow;
