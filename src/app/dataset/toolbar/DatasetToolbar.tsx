import { Label } from 'components/ui/Typography';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import DatasetContext from 'contexts/DatasetContext';
import NewRows from './NewRows';
import NewColumns from './NewColumns';

const BoardActionsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  .left {
    margin-right: auto;
    display: flex;
  }
  .right {
    display: flex;
    margin-left: auto;
    button {
      margin-left: 1rem;
    }
  }
`;

const TimeTravel = styled.div<{ disabled?: boolean }>`
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition-duration: 0.2s;
  cursor: pointer;
  ${props =>
    props.disabled
      ? `
    cursor: not-allowed;
    opacity: 0.2;
  `
      : `
    &:hover {
      * {
        color: ${Styles.purple400};
      }
    }
  `}
`;

const DatasetToolbar: React.FC<{
  currentVersionRef: React.MutableRefObject<string | undefined>;
  undo: () => void;
  redo: () => void;
}> = ({ currentVersionRef, undo, redo }) => {
  const { changeHistoryRef } = useContext(DatasetContext)!;

  const undoDisabled = currentVersionRef.current === changeHistoryRef.current?.[0];
  const redoDisabled =
    currentVersionRef.current ===
    changeHistoryRef.current?.[changeHistoryRef.current.length - 1];

  return (
    <BoardActionsContainer>
      <div className="left">
        <TimeTravel onClick={undo} disabled={undoDisabled}>
          <i className="fad fa-undo" />
          <Label>Undo</Label>
        </TimeTravel>
        <TimeTravel onClick={redo} disabled={redoDisabled}>
          <i className="fad fa-redo" />
          <Label>Redo</Label>
        </TimeTravel>
      </div>
      <div className="right">
        <NewColumns />
        <NewRows />
        {/* <ButtonPrimary onClick={() => setBoardData!(boardActions.newRow())}>
          Add row
        </ButtonPrimary>
        <ButtonPrimary
          onClick={() => setBoardData!(boardActions.newColumn(`col ${colLen + 1}`))}
        >
          Add Column
        </ButtonPrimary> */}
      </div>
    </BoardActionsContainer>
  );
};
export default DatasetToolbar;
