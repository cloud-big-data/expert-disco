import { Helper } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { IRow } from '../types';
import Cell from './Cell';
import { defaults } from './constants';

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${defaults.ROW_HEIGHT}rem;
`;

const RowIndexContainer = styled.div`
  width: 32px;
  max-width: 32px;
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    * {
      font-weight: bold;
    }
  }
`;

interface IRowProps extends IRow {
  position: {
    firstRow: boolean;
    lastRow: boolean;
  };
  rowIndex: number;
}

const Row: React.FC<IRowProps> = ({ _id, cells, position, rowIndex }) => {
  const { boardState, setBoardState, boardData } = useContext(DatasetContext)!;
  return (
    <RowContainer>
      <RowIndexContainer
        onClick={() => {
          setBoardState({
            ...boardState,
            rowsState: {
              ...boardState.rowsState,
              selectedRow: _id,
            },
            columnsState: {
              ...boardState.columnsState,
              selectedColumn: -1,
            },
          });
        }}
      >
        <Helper>{rowIndex}</Helper>
      </RowIndexContainer>
      {cells.map((cell, index) => (
        <Cell
          key={cell._id}
          rowId={_id}
          highlighted={
            boardState.cellsState.highlightedCells.includes(cell._id) ||
            boardState.rowsState.selectedRow === _id ||
            boardState.columnsState.selectedColumn === index
          }
          selected={boardState.cellsState.selectedCell === cell._id}
          active={boardState.cellsState.activeCell === cell._id}
          position={{
            lastRow: position.lastRow,
            lastColumn: index === cells.length - 1,
            firstColumn: index === 0,
          }}
          isCopying={boardState.cellsState.copyingCell === cell._id}
          colWidth={boardData.columns[index].colWidth}
          {...cell}
        />
      ))}
    </RowContainer>
  );
};

export default Row;
