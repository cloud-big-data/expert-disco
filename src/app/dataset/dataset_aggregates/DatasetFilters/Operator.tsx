import { IFilterLayer, LogicalOperators } from 'app/dataset/types';
import { IconButton } from 'components/ui/Buttons';
import Select from 'components/ui/Select';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

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
  index: number;
  incrementIndentation: (index: number) => void;
  parent?: boolean;
}> = ({ index, incrementIndentation, parent, state, setFiltersState }) => (
  <OperatorContainer first={parent}>
    {incrementIndentation(index)}
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
          R.assocPath(path ? [...path, 0] : [index], value, parentFilterState),
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
  </OperatorContainer>
);

export default Operator;
