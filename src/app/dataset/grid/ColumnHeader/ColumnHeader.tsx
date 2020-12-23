import DropdownMenu from 'components/DropdownMenu';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import returnUpdatedCells from '../../lib/returnUpdatedCells';
import { makeBoardActions } from '../../lib/makeBoardActions';
import { IBoardState, IColumn, ISortingLayer, SortDirections } from '../../types';
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
  margin-left: 0.25rem;
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
  const {
    readOnly,
    boardState,
    setBoardState,
    boardData,
    setBoardData,
    socket,
  } = useContext(DatasetContext)!;
  const boardActions = makeBoardActions(boardData);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = boardState.columnsState.activeColumn === columnIndex;
  const columnSorting = boardData.layers?.sortings.find(
    sorting => sorting.key === _id,
  );

  const handleSortingChange = (direction?: SortDirections) => {
    let sortingLayer: ISortingLayer = boardData.layers?.sortings ?? [];
    if (columnSorting?.key === _id) {
      sortingLayer = direction
        ? sortingLayer.map(layer =>
            layer.key === _id ? { ...layer, direction } : layer,
          )
        : sortingLayer.filter(layer => layer.key !== _id);
    } else if (direction) {
      sortingLayer = [...sortingLayer, { key: _id, direction }];
    }

    socket?.emit('layer', {
      layerKey: 'sortings',
      layerData: sortingLayer,
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [active]);

  const MENU_OPTIONS = [
    {
      label: 'Remove column',
      onClick: () => {
        setBoardData!(boardActions.removeColumn(_id));
      },
      icon: <i style={{ color: Styles.red400 }} className="fal fa-times-circle" />,
    },
    {
      label: 'Format',
      onClick: () => undefined,
      icon: <i style={{ color: Styles.blue }} className="fad fa-remove-format" />,
    },
    {
      label: 'Default sorting',
      onClick: handleSortingChange,
      icon: (
        <i
          style={{
            color: !columnSorting?.direction ? Styles.orange : Styles.dark400,
          }}
          className="fas fa-sort"
        />
      ),
    },
    {
      label: 'Sort A-Z',
      onClick: () => handleSortingChange('asc'),
      icon: (
        <i
          style={{
            color:
              columnSorting?.direction === 'asc' ? Styles.orange : Styles.dark400,
          }}
          className="fas fa-sort-down"
        />
      ),
    },
    {
      label: 'Sort Z-A',
      onClick: () => handleSortingChange('desc'),
      icon: (
        <i
          style={{
            color:
              columnSorting?.direction === 'desc' ? Styles.orange : Styles.dark400,
          }}
          className="fas fa-sort-up"
        />
      ),
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
        setBoardState(
          R.assocPath(['columnsState', 'activeColumn'], columnIndex, boardState),
        )
      }
      onClick={() =>
        setBoardState(
          R.pipe(
            R.assocPath(['columnsState', 'selectedColumn'], columnIndex),
            R.assocPath(['rowsState', 'selectedRow'], ''),
          )(boardState) as IBoardState,
        )
      }
    >
      <ColumnTypeIcon dataType={dataType} />
      {!readOnly && active ? (
        <ActiveInput
          ref={inputRef}
          value={value ?? ''}
          type="text"
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            const set = (key: string, value: any) =>
              R.over(R.lensProp('columnsState'), R.assoc(key, value));
            setBoardState(
              R.pipe(
                set('selectedColumn', 'columnIndex'),
                set('activeColumn', -1),
              )(boardState),
            );
          }}
          onChange={e =>
            setBoardData!(
              R.assoc(
                'columns',
                returnUpdatedCells<IColumn>({
                  iterable: boardData.columns,
                  cellUpdates: [{ cellId: _id, updatedValue: e.target.value }],
                }),
                boardData,
              ),
            )
          }
        />
      ) : (
        <Label>{value}</Label>
      )}
      <i
        style={{ marginLeft: 'auto' }}
        className={
          !columnSorting?.direction
            ? ''
            : columnSorting?.direction === 'asc'
            ? `fad fa-sort-down`
            : `fad fa-sort-up`
        }
      />
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
      {showContextMenu && (
        <DropdownMenu
          pos={{ top: 2.5 }}
          closeMenu={() => toggleShowContextMenu(false)}
          options={MENU_OPTIONS}
        />
      )}
    </ColumnHeaderContainer>
  );
};

export default ColumnHeader;
