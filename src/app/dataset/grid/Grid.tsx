import { Text } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import GridContext from 'contexts/GridContext';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';

import Styles from 'styles/Styles';
import { VariableSizeList as VirtualizedList } from 'react-window';
import { ChangeHistoryItem } from '../types';
import ColumnHeader from './ColumnHeader';
import HiddenColumnIndicator from './ColumnHeader/HiddenColumnIndicator';
import EventsProvider from './EventsProvider';
import HotkeysProvider from './HotkeysProvider';
import Row from './Row';
import updateColumnById from '../lib/updateColumnById';
import updateSmartColumnById from '../lib/updateSmartColumnById';
import { defaults } from './constants';

const GridContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  margin-top: 1rem;
  padding: 0 0.25rem 0 0;
  overflow-x: auto;
  overflow-y: hidden;
  height: 90vh;
  max-height: 90vh;
  overscroll-behavior: contain;
`;
const ColumnsContainer = styled.div`
  width: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  background: ${Styles.defaultBgColor};
  position: sticky;
  top: 0;
  margin-left: 32px;
  .columns__padding {
    content: '';
    display: flex;
    width: 32px;
    max-width: 32px;
    flex: 1 0 auto;
    z-index: 3;
    margin-left: -32px;
    margin-top: -64px;
    position: fixed;
    max-height: 90vh;
    overflow: hidden;
    background: ${Styles.defaultBgColor};
  }
`;

const Grid: React.FC<{
  gridRef: React.RefObject<HTMLDivElement>;
  visibleRows: [number, number];
  setVisibleRows: (visibleRows: [number, number]) => void;
  undo: () => void;
  redo: () => void;
  handleChange: (changeHistoryItem: ChangeHistoryItem) => void;
}> = ({ gridRef, visibleRows, setVisibleRows, undo, redo, handleChange }) => {
  const { boardData, setBoardData, readOnly, getRowSlice } = useContext(
    DatasetContext,
  )!;
  const listRef = useRef<VirtualizedList>(null);
  const { rows, columns } = boardData;
  const [firstVisibleRow, lastVisibleRow] = visibleRows;
  const columnLookup = R.indexBy(R.prop('_id'), boardData.columns);

  const scrollTimeout = useRef(-1);

  const makeRow = React.memo(({ index, style }: any) => {
    const row = rows[index];
    return (
      <div style={style}>
        {rows.length > 0 ? (
          <Row
            key={row._id}
            {...row}
            columnLookup={columnLookup}
            rowIndex={row.index}
            position={{
              firstRow: index === 0,
              lastRow: index === rows.length - 1,
            }}
          />
        ) : (
          <Text
            style={{ marginLeft: '32px', marginTop: '1rem' }}
            len="short"
            size="lg"
          >
            Your query returned no results
          </Text>
        )}
      </div>
    );
  });

  return (
    <GridContext.Provider
      value={{
        gridRef,
        visibleRows: [firstVisibleRow, lastVisibleRow],
        handleChange,
      }}
    >
      <GridContainer ref={gridRef}>
        <EventsProvider>
          <HotkeysProvider
            undo={!readOnly ? undo : () => undefined}
            redo={!readOnly ? redo : () => undefined}
          >
            <ColumnsContainer>
              <div className="columns__padding" />
              {columns.map((col, index) =>
                col.hidden ? (
                  <HiddenColumnIndicator
                    key={col._id}
                    value={col.value}
                    onShow={() => {
                      setBoardData?.(
                        R.pipe(
                          updateColumnById(col._id, { hidden: false }),
                          R.ifElse(
                            () => col.isSmartColumn === true,
                            updateSmartColumnById(col._id, { hidden: false }),
                            R.identity,
                          ),
                          R.ifElse(
                            () => col.isJoined === true,
                            R.assocPath(['layers', 'joins', 'hidden'], false),
                            R.identity,
                          ),
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                        )(boardData),
                      );
                    }}
                  />
                ) : (
                  <ColumnHeader
                    key={col._id}
                    {...col}
                    columnIndex={index}
                    position={{
                      firstColumn: index === 0,
                      lastColumn: index === columns.length - 1,
                    }}
                  />
                ),
              )}
            </ColumnsContainer>

            <VirtualizedList
              ref={listRef}
              height={gridRef.current?.scrollHeight ?? 900}
              itemCount={boardData.rows?.length ?? 0}
              itemSize={() => defaults.ROW_HEIGHT * 16}
              width={gridRef.current?.scrollWidth ?? 1000}
              onScroll={() => {
                const grid = gridRef.current;
                if (!grid) return;

                const firstVisibleIndex = R.pipe(
                  R.find(
                    (node: any) =>
                      node.getBoundingClientRect().top >
                      grid.getBoundingClientRect().top,
                  ),
                  R.pathOr('0', ['dataset', 'rowIndex']),
                  parseInt,
                )([...grid.querySelectorAll('div.row__index')]);

                const newVisibleRows = R.pipe(
                  (item: number) => (item - 50 < 0 ? 0 : item - 50),
                  item => [item, item + 100] as [number, number],
                )(firstVisibleIndex);

                clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                  if (firstVisibleRow !== newVisibleRows[0]) {
                    getRowSlice(...newVisibleRows);
                    setVisibleRows(newVisibleRows);
                  }
                }, 200);
              }}
            >
              {makeRow}
            </VirtualizedList>
          </HotkeysProvider>
        </EventsProvider>
      </GridContainer>
    </GridContext.Provider>
  );
};

export default Grid;
