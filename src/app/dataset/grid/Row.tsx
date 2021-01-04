import { Helper } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';
import { IBoardState, IRow } from '../types';
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
  p {
    font-size: 0.5rem;
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
        data-row-index={rowIndex}
        className="row__index"
        onClick={() =>
          setBoardState(
            R.pipe(
              R.assocPath(['rowsState', 'selectedRow'], _id),
              R.assocPath(['columnsState', 'selectedColumn'], -1),
            )(boardState) as IBoardState,
          )
        }
      >
        <Helper>{rowIndex}</Helper>
      </RowIndexContainer>
      {cells.map((cell, index) => (
        <Cell
          key={cell._id}
          colIndex={index}
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
          colFormat={boardData.columns[index].format}
          {...cell}
        />
      ))}
    </RowContainer>
  );
};

export default Row;
