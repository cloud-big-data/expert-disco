import { Label } from 'components/ui/Typography';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import DatasetContext from 'contexts/DatasetContext';
import { ButtonTertiary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Switch } from 'antd';
import NewRows from './NewRows';
import NewColumns from './NewColumns';
import updateColumnById from '../lib/updateColumnById';

const BoardActionsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  .left {
    margin-right: auto;
    display: flex;
  }
  .right,
  .top,
  .bottom {
    display: flex;
    margin-left: auto;
    button {
      margin-left: 1rem;
    }
  }
  .right {
    flex-direction: column;
  }

  .bottom button {
    border: 1px solid transparent;
    align-items: center;
    padding: 0.5rem;
    margin-right: -0.5rem;
    font-size: 0.75rem;
  }
  .bottom button:hover {
    p {
      color: ${Styles.purple400} !important;
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

const FormatContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 2rem;
  button {
    margin-left: 1rem;
    &:disabled,
    &:disabled i {
      opacity: 0.3;
    }
  }

  .group {
    margin-left: 3rem;
  }
`;

const DatasetToolbar: React.FC<{
  currentVersion: string | undefined;
  undo: () => void;
  redo: () => void;
}> = ({ currentVersion, undo, redo }) => {
  const [rowSelectOpen, setRowSelectOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(1);
  const {
    changeHistoryRef,
    socket,
    boardState,
    boardData,
    setBoardData,
  } = useContext(DatasetContext)!;

  const undoDisabled = currentVersion === changeHistoryRef.current?.[0];
  const redoDisabled =
    currentVersion ===
    changeHistoryRef.current?.[changeHistoryRef.current.length - 1];

  const { selectedColumn } = boardState.columnsState;
  const columnAtIndex = boardData.columns?.[selectedColumn];
  const { formatSettings } = columnAtIndex ?? {};

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
        <FormatContainer>
          {columnAtIndex?.dataType === 'number' && (
            <>
              <ButtonTertiary
                disabled={formatSettings?.decimalPoints === 0}
                onClick={
                  columnAtIndex
                    ? () =>
                        setBoardData?.(
                          updateColumnById(
                            columnAtIndex._id,
                            {
                              formatSettings: {
                                ...formatSettings,
                                decimalPoints:
                                  (formatSettings?.decimalPoints ?? 2) - 1,
                              },
                            },
                            boardData,
                          ),
                        )
                    : undefined
                }
                style={{ fontWeight: 400, padding: 0 }}
              >
                .00&nbsp;&nbsp;
                <i className="fad fa-arrow-left" />
              </ButtonTertiary>
              <ButtonTertiary
                disabled={
                  (columnAtIndex.format === 'currency' &&
                    formatSettings?.decimalPoints === 1) ||
                  formatSettings?.decimalPoints === 20 // toFixed() method requires <= 20
                }
                onClick={
                  columnAtIndex
                    ? () =>
                        setBoardData?.(
                          updateColumnById(
                            columnAtIndex._id,
                            {
                              formatSettings: {
                                ...formatSettings,
                                decimalPoints:
                                  (formatSettings?.decimalPoints ?? 2) + 1,
                              },
                            },
                            boardData,
                          ),
                        )
                    : undefined
                }
                style={{ fontWeight: 400, padding: 0 }}
              >
                .00&nbsp;&nbsp;
                <i className="fad fa-arrow-right" />
              </ButtonTertiary>
              {columnAtIndex.format !== 'currency' && (
                <div className="group">
                  <Label unBold>
                    commas
                    <Switch
                      onChange={checked =>
                        setBoardData?.(
                          updateColumnById(
                            columnAtIndex._id,
                            {
                              formatSettings: {
                                ...formatSettings,
                                commas: checked,
                              },
                            },
                            boardData,
                          ),
                        )
                      }
                      checked={formatSettings?.commas ?? true}
                    />
                  </Label>
                </div>
              )}
            </>
          )}
        </FormatContainer>
      </div>
      <div className="right">
        <div className="top">
          <NewColumns />
          <NewRows />
        </div>
        <div className="bottom">
          <ButtonTertiary onClick={() => setRowSelectOpen(!rowSelectOpen)}>
            <span style={{ color: rowSelectOpen ? Styles.purple400 : 'initial' }}>
              Jump to row
            </span>
          </ButtonTertiary>
        </div>
        {rowSelectOpen && (
          <InputField
            type="number"
            icon={<i className="fad fa-search" />}
            value={selectedRow}
            onChange={e => setSelectedRow(parseInt(e.target.value, 10))}
            onConfirm={
              selectedRow
                ? () => socket?.emit('getSlice', selectedRow)
                : () => undefined
            }
            confirmText="Go"
            min={0}
          />
        )}
      </div>
    </BoardActionsContainer>
  );
};
export default DatasetToolbar;
