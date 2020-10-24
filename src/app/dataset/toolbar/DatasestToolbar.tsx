import { ButtonPrimary } from 'components/ui/Buttons';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import { makeToolbarActions } from '../lib/toolbarActions';

const BoardActionsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  .left {
    margin-right: auto;
    display: flex;
  }
  .right {
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
        color: ${Styles.purple};
      }
    }
  `}
`;

const DatasestToolbar: React.FC = () => {
  const { boardData, setBoardData, changeHistoryRef, currentRevision } = useContext(
    DatasetContext,
  )!;
  const boardActions = makeToolbarActions(boardData);
  const colLen = boardData.columns.length;

  return (
    <BoardActionsContainer>
      <div className="left">
        <TimeTravel
          onClick={() => {
            if (
              !currentRevision ||
              currentRevision?.current === changeHistoryRef.current[0].revisionId
            )
              return;

            const current = changeHistoryRef.current.findIndex(
              x => x.revisionId === currentRevision.current,
            );

            setBoardData!(
              R.omit(['revisionId'], changeHistoryRef.current[current - 1]),
            );
          }}
          disabled={changeHistoryRef.current.length === 0}
        >
          <i className="fad fa-undo" />
          <Label>Undo</Label>
        </TimeTravel>
        <TimeTravel>
          <i className="fad fa-redo" />
          <Label>Redo</Label>
        </TimeTravel>
      </div>
      <div className="right">
        <ButtonPrimary onClick={() => setBoardData!(boardActions.newRow())}>
          Add row
        </ButtonPrimary>
        <ButtonPrimary
          onClick={() => setBoardData!(boardActions.newColumn(`col ${colLen + 1}`))}
        >
          Add Column
        </ButtonPrimary>
      </div>
    </BoardActionsContainer>
  );
};

export default DatasestToolbar;
