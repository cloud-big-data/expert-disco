import DropdownMenu from 'components/DropdownMenu';
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
import ColumnTypeIcon from './ColumnTypeIcon';

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

const MenuTrigger = styled.div`
  cursor: pointer;
  transition-duration: 0.2s;
  display: flex;
  margin-left: auto;
  align-self: center;
  margin-right: 0.25rem;
  opacity: 0.4;
  &:hover {
    opacity: 1;
    i {
      color: ${Styles.blue};
    }
  }
`;

const ColumnHeader: React.FC<IColumnHeaderProps> = ({
  value,
  colWidth,
  position,
  columnIndex,
  _id,
  dataType,
}) => {
  const [showContextMenu, toggleShowContextMenu] = useState(false);
  const { boardState, setBoardState, boardData, setBoardData } = useContext(
    DatasetContext,
  )!;
  const boardActions = makeBoardActions(boardData);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = boardState.columnsState.activeColumn === columnIndex;

  useEffect(() => {
    inputRef.current?.focus();
  }, [active]);

  const MENU_OPTIONS = [
    {
      label: 'Remove column',
      onClick: () => {
        setBoardData!(boardActions.removeColumn(_id));
      },
      icon: <i style={{ color: Styles.red }} className="fal fa-times-circle" />,
    },
    {
      label: 'Sort',
      onClick: () => undefined,
      icon: <i style={{ color: Styles.orange }} className="fad fa-sort" />,
    },
    {
      label: 'Format',
      onClick: () => undefined,
      icon: <i style={{ color: Styles.blue }} className="fad fa-remove-format" />,
    },
  ];

  return (
    <ColumnHeaderContainer
      onContextMenu={e => {
        e.preventDefault();
        toggleShowContextMenu(!showContextMenu);
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
      <ColumnTypeIcon dataType={dataType} />
      {showContextMenu && (
        <DropdownMenu
          closeMenu={() => toggleShowContextMenu(false)}
          options={MENU_OPTIONS}
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
      <MenuTrigger
        onDoubleClick={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation();
          toggleShowContextMenu(true);
        }}
      >
        <i className="fas fa-chevron-square-down" />
      </MenuTrigger>
      <DraggableColEdge colWidth={colWidth ?? defaults.COL_WIDTH} colId={_id} />
    </ColumnHeaderContainer>
  );
};

export default ColumnHeader;
