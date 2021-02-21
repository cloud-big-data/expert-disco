import { Text } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import GridContext from 'contexts/GridContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';

import Styles from 'styles/Styles';
import { ChangeHistoryItem } from '../types';
import ColumnHeader from './ColumnHeader';
import HiddenColumnIndicator from './ColumnHeader/HiddenColumnIndicator';
import EventsProvider from './EventsProvider';
import HotkeysProvider from './HotkeysProvider';
import Row from './Row';
import updateColumnById from '../lib/updateColumnById';
import updateSmartColumnById from '../lib/updateSmartColumnById';

const GridContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
  padding: 0 0.25rem;
  max-width: 100%;
  overflow: auto;
  height: 75vh;
  max-height: 75vh;
`;
const ColumnsContainer = styled.div`
  width: 100%;
  flex: 0 1 100%;
  display: flex;
  align-items: center;
  background: ${Styles.defaultBgColor};
  position: sticky;
  top: 0;
  &:before {
    content: '';
    display: flex;
    width: 32px;
    max-width: 32px;
    flex: 1 0 auto;
  }
`;
const RowsContainer = styled.div`
  width: 100%;
  flex: 1 0 100%;
  display: flex;
  flex-direction: column;
`;

const Grid: React.FC<{
  gridRef: React.RefObject<HTMLDivElement>;
  visibleRows: [number, number];
  undo: () => void;
  redo: () => void;
  handleChange: (changeHistoryItem: ChangeHistoryItem) => void;
}> = ({ gridRef, visibleRows, undo, redo, handleChange }) => {
  const { boardData, setBoardData, readOnly } = useContext(DatasetContext)!;
  const { rows, columns } = boardData;
  const [firstVisibleRow, lastVisibleRow] = visibleRows;

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
            <RowsContainer>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <Row
                    key={row._id}
                    {...row}
                    rowIndex={row.index}
                    position={{
                      firstRow: index === 0,
                      lastRow: index === rows.length - 1,
                    }}
                  />
                ))
              ) : (
                <Text
                  style={{ marginLeft: '32px', marginTop: '1rem' }}
                  len="short"
                  size="lg"
                >
                  Your query returned no results
                </Text>
              )}
            </RowsContainer>
          </HotkeysProvider>
        </EventsProvider>
      </GridContainer>
    </GridContext.Provider>
  );
};

export default Grid;
