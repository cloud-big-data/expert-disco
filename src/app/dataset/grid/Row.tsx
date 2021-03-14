import { Helper, Text } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';
import { Menu, Dropdown } from 'antd';
import GridContext from 'contexts/GridContext';
import Styles from 'styles/Styles';
import usePrevious from 'hooks/usePrevious';
import { IBoardState, IColumn, IRow } from '../types';
import Cell from './Cell';
import { defaults } from './constants';
import { makeBoardActions } from '../lib/makeBoardActions';
import findRowById from '../lib/findRowById';

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${defaults.ROW_HEIGHT}rem;
  .cells__container {
    display: flex;
    /* margin-left: 32px; */
    height: ${defaults.ROW_HEIGHT}rem;
  }
`;

const RowIndexContainer = styled.div`
  position: sticky;
  z-index: 1;
  background: ${Styles.defaultBgColor};
  height: ${defaults.ROW_HEIGHT}rem;
  width: 32px;
  max-width: 32px;
  justify-content: center;
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
  columnLookup: {
    [x: string]: IColumn;
  };
}

const MenuIcon = styled.i`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
`;

const Row: React.FC<IRowProps> = ({
  _id,
  cells,
  position,
  rowIndex,
  columnLookup,
}) => {
  const {
    boardState,
    setBoardState,
    boardData,
    setBoardData,
    datasetHead,
  } = useContext(DatasetContext)!;
  const { handleChange } = useContext(GridContext)!;
  const boardActions = makeBoardActions(boardData);
  const prevRowValue = usePrevious(findRowById(_id, boardData));

  const menu = (
    <Menu>
      <Menu.ItemGroup>
        <Menu.Item
          disabled={boardData.columns.length === 1}
          onClick={() => {
            const newBoardData = boardActions.removeRow(_id);

            handleChange?.({
              changeTarget: 'row',
              targetId: _id,
              prevValue: prevRowValue,
              newValue: findRowById(_id, newBoardData),
            });
            setBoardData?.(newBoardData);
          }}
        >
          <MenuIcon
            style={{ color: Styles.red400 }}
            className="fal fa-times-circle"
          />
          Remove row
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown trigger={['contextMenu']} overlay={menu}>
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
        </Dropdown>
        <RowContainer>
          <div className="cells__container">
            {cells
              .filter(cell => !cell || !!columnLookup[cell.columnId ?? ''])
              .map((cell, index) => {
                const column = columnLookup[cell?.columnId ?? ''];
                if (!cell) {
                  return (
                    <Cell
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      colIndex={index}
                      rowId={_id}
                      highlighted={false}
                      selected={false}
                      active={false}
                      position={{
                        lastRow: position.lastRow,
                        lastColumn: index === cells.length - 1,
                        firstColumn: index === 0,
                      }}
                      isCopying={false}
                      colWidth={column?.colWidth}
                      colFormat={column?.format}
                      formatSettings={column?.formatSettings}
                      {...cell}
                    />
                  );
                }
                return !column?.hidden ? (
                  <Cell
                    key={cell?._id}
                    associatedColumn={column}
                    rowId={_id}
                    highlighted={
                      boardState.cellsState.highlightedCells.includes(cell?._id) ||
                      boardState.rowsState.selectedRow === _id ||
                      boardState.columnsState.selectedColumn === index
                    }
                    selected={boardState.cellsState.selectedCell === cell?._id}
                    active={boardState.cellsState.activeCell === cell?._id}
                    position={{
                      lastRow: position.lastRow,
                      lastColumn: index === cells.length - 1,
                      firstColumn: index === 0,
                    }}
                    isCopying={boardState.cellsState.copyingCell === cell?._id}
                    colWidth={column?.colWidth}
                    colFormat={column?.format}
                    formatSettings={column?.formatSettings}
                    {...cell}
                  />
                ) : (
                  <div
                    key={cell?._id}
                    style={{ border: '16px solid transparent' }}
                  />
                );
              })}
          </div>
        </RowContainer>
      </div>

      {(datasetHead?.rowCount ?? -1) === rowIndex && (
        <Text style={{ marginLeft: '32px', marginTop: '0' }} len="short" size="lg">
          End of records
        </Text>
      )}
    </>
  );
};

export default Row;
