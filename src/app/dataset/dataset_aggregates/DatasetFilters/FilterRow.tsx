import { IFilterLayer } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import { Empty } from 'antd';
import { ButtonPrimary } from 'components/ui/Buttons';
import { OperatorBreak } from '../Styles';
import { FilterContext } from './DatasetFilters';
import Condition from './Condition';
import Operator from './Operator';

const FilterRowContainer = styled.div<{ parent: boolean; indentation: number }>`
  display: flex;
  flex-direction: column;
  margin-left: ${props => (props.indentation ? props.indentation * 1.75 : 0)}rem;
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
    const defaultCondition: IFilterLayer = [
      'AND',
      {
        filterId: uuidv4(),
        key: boardData.columns[0]._id,
        predicateType: 'equals',
        value: '',
      },
    ];
    const path_ = path ? [...path, index] : [index];
    setFiltersState(
      index === 0
        ? defaultCondition
        : R.over(
            R.lensPath(path_.slice(0, path_.length - 1)),
            R.append(defaultCondition),
            parentFilterState!,
          ),
    );
  };

  return (
    <>
      {sortedFiltersState.length > 0 ? (
        sortedFiltersState.map((state, index) => (
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
        ))
      ) : (
        <Empty
          description={
            <span>
              Use a combination of "and" and "or" filtering rules on your dataset.
            </span>
          }
        >
          <ButtonPrimary style={{ margin: '0 auto' }} onClick={() => addOperator(0)}>
            Add a filter
          </ButtonPrimary>
        </Empty>
      )}
    </>
  );
};

export default FilterRow;
