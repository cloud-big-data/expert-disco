import { ButtonPrimary } from 'components/ui/Buttons';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { makeToolbarActions } from '../lib/toolbarActions';

const BoardActionsContainer = styled.div`
  display: flex;
  margin-left: auto;
  button {
    margin-left: 1rem;
  }
`;

const Toolbar: React.FC = () => {
  const { boardData, setBoardData } = useContext(DatasetContext)!;
  const boardActions = makeToolbarActions(boardData);
  return (
    <>
      <BoardActionsContainer>
        <ButtonPrimary onClick={() => setBoardData!(boardActions.newRow())}>
          Add row
        </ButtonPrimary>
        <ButtonPrimary onClick={() => setBoardData!(boardActions.newColumn())}>
          Add Column
        </ButtonPrimary>
      </BoardActionsContainer>
    </>
  );
};

export default Toolbar;
