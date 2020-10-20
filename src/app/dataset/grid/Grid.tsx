import Loading from 'components/ui/Loading';
import DatasetContext from 'contexts/DatasetContext';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import { initialBoardState } from '../wrappers/DatasetWrapper';
import ColumnHeader from './ColumnHeader';
import Row from './Row';

const GridContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
  padding: .25rem;
`;
const ColumnsContainer = styled.div`
  width: 100%;
  flex: 0 1 100%;
  display: flex;
  align-items: center;
  margin-left: 2rem;
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
const AddColumn = styled.div`
  margin-left: 2rem;
`;
const AddRow = styled.div`
  margin-top: 1rem;
`;

/*
local state:
- cell(s) is/are highlighted
- cell(s) is/are active

lifted state:
- column/row width/height
- cell content
*/


const Grid: React.FC = () => {
  const dataset = useContext(DatasetContext);
  const gridRef = useRef(null);
  const {boardState, gridData, setBoardState} = dataset!;

  useHandleClickOutside(gridRef, () => {
    setBoardState(initialBoardState);
  })
  
  if (!dataset) {
    return (
      <div className="absolute__center">
        <Loading />
      </div>
    )
  }

  const {rows, columns} = gridData;

  return (
    <GridContainer ref={gridRef}>
      <ColumnsContainer>
        {columns.map((col, index) =>
          <ColumnHeader
            key={col._id}
            {...col}
            columnIndex={index}
            position={{
              firstColumn: index === 0,
              lastColumn: index === columns.length - 1,
            }}
          />
        )}
        <AddColumn>
          <i className="fad fa-plus-circle" />
        </AddColumn>
      </ColumnsContainer>
      <RowsContainer>
        {rows.map((row, index) => 
          <Row
            key={row._id}
            {...row}
            rowIndex={index}
            position={{
              firstRow: index === 0,
              lastRow: index === rows.length - 1,
            }}
          />
        )}
        <AddRow>
          <i className="fad fa-plus-circle" />
        </AddRow>
      </RowsContainer>
    </GridContainer>
  )
}

export default Grid;