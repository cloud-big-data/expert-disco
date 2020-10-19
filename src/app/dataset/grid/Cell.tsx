import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import { ICell } from '../types';
import { defaults } from './constants';


interface ICellProps extends ICell {
  position: {
    lastRow: boolean;
    lastColumn: boolean;
    firstColumn: boolean;
  };
}

const CellContainer = styled.div<{
  highlighted?: boolean;
  active?: boolean;
  selected?: boolean;
  position: ICellProps['position'];
}>`
  display: flex;
  align-items: center;
  height: 100%;
  width: ${defaults.COL_WIDTH}rem;
  padding: .5rem;

  border-top: 2px solid ${Styles.faintBorderColor};
  border-left: 2px solid ${Styles.faintBorderColor};
  ${props =>
    props.position.lastRow ? `
      border-bottom: 2px solid ${Styles.faintBorderColor};
    ` : ''
  }
  ${props =>
    props.position.lastColumn ? `
      border-left: 1px solid ${Styles.faintBorderColor};
      border-right: 2px solid ${Styles.faintBorderColor};
    ` : ''
  }
  ${props =>
    props.position.lastRow && props.position.lastColumn ? `
      border-radius: 0 0 ${Styles.defaultBorderRadius} 0;
    ` : ''
  }

  ${props =>
    props.position.lastRow && props.position.firstColumn ? `
      border-radius: 0 0 0 ${Styles.defaultBorderRadius};
    ` : ''
  }

  ${props => props.selected ? `
    border: 2px solid ${Styles.purple};
    border-radius: ${Styles.defaultBorderRadius};
  ` : ''}

  ${props => props.highlighted ? `
    background: ${Styles.purpleAccent};
  ` : ''}
`;


const Cell: React.FC<ICellProps> = ({
  _id,
  value,
  highlighted,
  active,
  selected,
  position,
}) => {
  return (
    <CellContainer
      active={active}
      highlighted={highlighted}
      position={position}
      selected={selected}
    >
      {value}
    </CellContainer>
  );
}

export default Cell;