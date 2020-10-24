import { ButtonPrimary } from 'components/ui/Buttons';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from '../types';

const BoardActionsContainer = styled.div`
  display: flex;
  margin-left: auto;
  button {
    margin-left: 1rem;
  }
`;

const Toolbar: React.FC = () => {
  const { boardData, setBoardData } = useContext(DatasetContext)!;
  return (
    <>
      <BoardActionsContainer>
        <ButtonPrimary
          onClick={() =>
            setBoardData!({
              ...boardData,
              rows: [
                ...boardData.rows,
                {
                  _id: uuidv4(),
                  cells: boardData.rows[0].cells.map(cell => ({
                    ...cell,
                    _id: uuidv4(),
                    value: '',
                  })),
                },
              ],
            })
          }
        >
          Add row
        </ButtonPrimary>
        <ButtonPrimary
          onClick={() =>
            setBoardData!({
              ...boardData,
              columns: [
                ...boardData.columns,
                {
                  _id: uuidv4(),
                  value: '',
                  dataType: DataTypes.string,
                },
              ],
              rows: boardData.rows.map(row => ({
                ...row,
                cells: [
                  ...row.cells,
                  {
                    _id: uuidv4(),
                    value: '',
                  },
                ],
              })),
            })
          }
        >
          Add Column
        </ButtonPrimary>
      </BoardActionsContainer>
    </>
  );
};

export default Toolbar;
