import Loading from 'components/ui/Loading';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
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
  padding: 0.25rem;
  max-width: 100%;
  overflow: auto;
`;
const ColumnsContainer = styled.div`
  width: 100%;
  flex: 0 1 100%;
  display: flex;
  align-items: center;
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
  /* .shrink-wrapped {
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
  } */
`;

const Grid: React.FC = () => {
  const dataset = useContext(DatasetContext);
  const { boardData, setBoardData, boardState, setBoardState } = dataset!;

  if (!dataset) {
    return (
      <div className="absolute__center">
        <Loading />
      </div>
    );
  }

  const { rows, columns } = boardData;

  return (
    <GridContainer>
      <EventsProvider
        boardData={boardData}
        boardState={boardState}
        setBoardState={setBoardState}
      >
        <HotkeysProvider
          boardState={boardState}
          setBoardState={setBoardState}
          boardData={boardData}
          setBoardData={setBoardData!}
        >
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
  );
};

export default Grid;
