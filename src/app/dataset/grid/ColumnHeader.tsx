import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import { IColumn } from '../types';
import { defaults } from './constants';

interface IColumnHeaderProps extends IColumn {
  columnIndex: number;
  position: {
    firstColumn: boolean;
    lastColumn: boolean;
  }
}

const ColumnHeaderContainer = styled.div<{
  colWidth: number;
  position: IColumnHeaderProps['position'];
}>`
  cursor: pointer;
  background: #F1EFF3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: ${props => props.colWidth}rem;

  &:hover {
    font-weight: bold;
  }

  &:not(:first-of-type) {
    border-left: 1px solid rgba(0,0,0,.1);
  }

  ${props =>
    props.position.firstColumn ? `
      border-radius: ${Styles.defaultBorderRadius} 0 0 0;
    ` : ``
  }
  ${props =>
    props.position.lastColumn ? `
      border-radius: 0 ${Styles.defaultBorderRadius} 0 0;
    ` : ``
  }
`;



const ColumnHeader: React.FC<IColumnHeaderProps> = ({
  title,
  colWidth,
  highlighted,
  dragging,
  position,
  columnIndex,
}) => {
  const { boardState, setBoardState } = useContext(DatasetContext)!;
  return (
    <ColumnHeaderContainer
      position={position}
      colWidth={colWidth ?? defaults.COL_WIDTH}
      onClick={() => setBoardState({
        ...boardState,
        columnsState: {
          ...boardState.columnsState,
          selectedColumn: columnIndex,
        },
        rowsState: {
          ...boardState.rowsState,
          selectedRow: '',
        }
      })}
    >
      <Label>
        {title.label}
      </Label>
    </ColumnHeaderContainer>
  )
}

export default ColumnHeader;