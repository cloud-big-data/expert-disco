import { IFilterLayer, LogicalOperators } from 'app/dataset/types';
import { IconButton } from 'components/ui/Buttons';
import Select from 'components/ui/Select';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';
import DatasetContext from 'contexts/DatasetContext';

const OperatorContainer = styled.div<{ first?: boolean }>`
  display: flex;
  align-items: center;
  ${props =>
    !props.first
      ? `
    margin-top: 2rem;
  `
      : ``}
`;

const Operator: React.FC<{
  state: LogicalOperators;
  setFiltersState: (filterState: IFilterLayer) => void;
  parentFilterState: IFilterLayer;
  index: number;
  incrementIndentation: (index: number) => void;
  parent?: boolean;
  path: number[];
}> = ({ path, parentFilterState, index, parent, state, setFiltersState }) => {
  const { boardData } = useContext(DatasetContext)!;
  return (
    <OperatorContainer first={parent}>
      {!parent && (
        <IconButton>
          <i
            style={{ color: Styles.red, marginRight: '.5rem' }}
            className="far fa-times"
          />
        </IconButton>
      )}
      <Select
        fill={Styles.blue}
        onChange={value =>
          setFiltersState(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            R.assocPath(path, value, parentFilterState),
          )
        }
        options={[
          { name: 'and', value: 'AND' },
          { name: 'or', value: 'OR' },
        ]}
        placeholder="select and/or"
        value={state}
      />
      <IconButton
        onClick={() => {
          setFiltersState(
            R.over(
              R.lensPath(path.slice(0, path.length - 1)),
              R.append({
                filterId: uuidv4(),
                key: boardData.columns[0]._id,
                predicateType: 'equals',
                value: '',
              }),
              parentFilterState,
            ),
          );
        }}
      >
        <i
          style={{ color: Styles.green, marginLeft: '.5rem' }}
          className="fas fa-plus-square"
        />
      </IconButton>
    </OperatorContainer>
  );
};

export default Operator;
