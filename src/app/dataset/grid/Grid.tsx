import DatasetContext from 'contexts/DatasetContext';
import GridContext from 'contexts/GridContext';
import useFindVisibleRows from 'hooks/useFindVisibleRows';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import ColumnHeader from './ColumnHeader';
import EventsProvider from './EventsProvider';
import HotkeysProvider from './HotkeysProvider';
import Row from './Row';

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
  background: white;
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

const Grid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { boardData } = useContext(DatasetContext)!;
  const { rows, columns } = boardData;
  const [firstVisibleRow, lastVisibleRow] = useFindVisibleRows(gridRef);

  console.log(firstVisibleRow, lastVisibleRow);
  return (
    <GridContext.Provider
      value={{
        gridRef,
      }}
    >
      <GridContainer ref={gridRef}>
        <EventsProvider>
          <HotkeysProvider>
            <ColumnsContainer>
              {columns.map((col, index) => (
                <ColumnHeader
                  key={col._id}
                  {...col}
                  columnIndex={index}
                  position={{
                    firstColumn: index === 0,
                    lastColumn: index === columns.length - 1,
                  }}
                />
              ))}
            </ColumnsContainer>
            <RowsContainer>
              {rows.map((row, index) => (
                <Row
                  key={row._id}
                  {...row}
                  rowIndex={index}
                  position={{
                    firstRow: index === 0,
                    lastRow: index === rows.length - 1,
                  }}
                />
              ))}
            </RowsContainer>
          </HotkeysProvider>
        </EventsProvider>
      </GridContainer>
    </GridContext.Provider>
  );
};

export default Grid;
