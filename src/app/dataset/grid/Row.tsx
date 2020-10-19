import React from 'react';
import styled from 'styled-components/macro';
import { IRow } from '../types';
import Cell from './Cell';
import { defaults } from './constants';

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${defaults.ROW_HEIGHT}rem;
`;

interface IRowProps extends IRow {
  position: {
    firstRow: boolean;
    lastRow: boolean;
  }
}

const Row: React.FC<IRowProps> = ({
  _id,
  cells,
  rowHeight,
  highlighted,
  dragging,
  position,
}) => {
  return (
    <RowContainer>
      {cells.map((cell, index) =>
        <Cell
          key={cell._id}
          highlighted={index === 1}
          selected={cell._id === 'yo14'}
          position={{
            lastRow: position.lastRow,
            lastColumn: index === cells.length - 1,
            firstColumn: index === 0,
          }}
          {...cell}
        />
      )}
    </RowContainer>
  )
}

export default Row;