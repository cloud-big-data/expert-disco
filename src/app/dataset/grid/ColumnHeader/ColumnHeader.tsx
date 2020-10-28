import RightClickMenu from 'components/RightClickMenu';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import returnUpdatedCells from '../../lib/returnUpdatedCells';
import { makeBoardActions } from '../../lib/makeBoardActions';
import { IColumn } from '../../types';
import { defaults } from '../constants';
import { ActiveInput } from '../styles';
import DraggableColEdge from './DraggableColEdge';

interface IColumnHeaderProps extends IColumn {
  columnIndex: number;
  position: {
    firstColumn: boolean;
    lastColumn: boolean;
  };
}

const ColumnHeaderContainer = styled.div<{
  colWidth: number;
  position: IColumnHeaderProps['position'];
  active: boolean;
}>`
  background: #f1eff3;
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  height: 2rem;
  width: ${props => props.colWidth}px;
  max-width: ${props => props.colWidth}px;
  overflow: hidden;
  padding: 0.5rem;
  padding-right: 0;

  &:hover {
    font-weight: bold;
  }

  &:not(:first-of-type) {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }

  ${props =>
    props.position.firstColumn
      ? `
      border-radius: ${Styles.defaultBorderRadius} 0 0 0;
    `
      : ``}
  ${props =>
    props.position.lastColumn
      ? `
      border-radius: 0 ${Styles.defaultBorderRadius} 0 0;
    `
      : ``}
`;

const ColumnHeader: React.FC<IColumnHeaderProps> = ({
  value,
  colWidth,
  position,
  columnIndex,
  _id,
}) => {
  const [showRightClickMenu, toggleShowRightClickMenu] = useState(false);
  const { boardState, setBoardState, boardData, setBoardData } = useContext(
    DatasetContext,
  )!;
  const boardActions = makeBoardActions(boardData);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = boardState.columnsState.activeColumn === columnIndex;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [active]);

  return (
    <ColumnHeaderContainer
      onContextMenu={e => {
        e.preventDefault();
        toggleShowRightClickMenu(!showRightClickMenu);
      }}
      position={position}
      active={active}
      colWidth={colWidth ?? defaults.COL_WIDTH}
      onDoubleClick={() =>
        setBoardState({
          ...boardState,
          columnsState: {
            ...boardState.columnsState,
            activeColumn: columnIndex,
          },
        })
      }
      onClick={() =>
        setBoardState({
          ...boardState,
          columnsState: {
            ...boardState.columnsState,
            selectedColumn: columnIndex,
          },
          rowsState: {
            ...boardState.rowsState,
            selectedRow: '',
          },
        })
      }
    >
      {showRightClickMenu && (
        <RightClickMenu
          closeMenu={() => toggleShowRightClickMenu(false)}
          options={[
            {
              label: 'Remove column',
              onClick: () => {
                setBoardData!(boardActions.removeColumn(_id));
              },
              icon: (
                <i style={{ color: Styles.red }} className="fal fa-times-circle" />
              ),
            },
          ]}
        />
      )}
      {active ? (
        <ActiveInput
          ref={inputRef}
          value={value ?? ''}
          type="text"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setBoardState({
                ...boardState,
                columnsState: {
                  ...boardState.columnsState,
                  selectedColumn: columnIndex,
                  activeColumn: -1,
                },
              });
            }
          }}
          onChange={e =>
            setBoardData!({
              ...boardData,
              columns: returnUpdatedCells<IColumn>({
                iterable: boardData.columns,
                cellUpdates: [
                  {
                    cellId: _id,
                    updatedValue: e.target.value,
                  },
                ],
              }),
            })
          }
        />
      ) : (
        <Label>{value}</Label>
      )}
      <DraggableColEdge colWidth={colWidth ?? defaults.COL_WIDTH} colId={_id} />
    </ColumnHeaderContainer>
  );
};

export default ColumnHeader;
