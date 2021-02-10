import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import usePrevious from 'hooks/usePrevious';
import GridContext from 'contexts/GridContext';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import { Menu, Dropdown, Tooltip } from 'antd';
import typesAreCompatible from 'app/dataset/lib/typesAreCompatible';
import findColumnById from 'app/dataset/lib/findColumnById';
import { DATE_FORMATS, NUMBER_FORMATS, CURRENCY_CODES } from 'app/dataset/constants';
import updateColumnById from 'app/dataset/lib/updateColumnById';
import updateLayers from 'app/dataset/lib/updateLayers';
import returnUpdatedCells from '../../lib/returnUpdatedCells';
import { makeBoardActions } from '../../lib/makeBoardActions';
import {
  DataTypes,
  IBoardState,
  IColumn,
  ISortingLayer,
  SortDirections,
  Formats,
} from '../../types';
import { defaults, COLUMN_DATA_TYPES } from '../constants';
import { ActiveInput } from '../styles';
import DraggableColEdge from './DraggableColEdge';
import { ColumnTypeStyle } from './ColumnTypeIcon';

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
  box-shadow: ${Styles.xsBoxShadow};

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

const MenuIcon = styled.i`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
`;

const ColumnHeader: React.FC<IColumnHeaderProps> = ({
  value,
  colWidth,
  position,
  columnIndex,
  _id,
  dataType,
  format,
  formatSettings,
  isSmartColumn,
  isJoined,
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
  const { handleChange } = useContext(GridContext)!;

  const boardActions = makeBoardActions(boardData);
  const inputRef = useRef<HTMLInputElement>(null);
  const colHeaderRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef<undefined | string>(value);

  const prevActive = usePrevious(
    boardState.columnsState.activeColumn === columnIndex,
  );
  const prevColumnValue = usePrevious(findColumnById(_id, boardData));

  const active = boardState.columnsState.activeColumn === columnIndex;

  useHandleClickOutside(colHeaderRef, () =>
    active
      ? setBoardState(R.assocPath(['columnsState', 'activeColumn'], -1, boardState))
      : undefined,
  );

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

  useEffect(() => {
    if (prevActive && !active) {
      handleChange?.({
        targetId: _id,
        changeTarget: 'column',
        prevValue: prevValue.current,
        newValue: value,
      });
    }
  });

  const menu = (
    <Menu>
      <Menu.ItemGroup>
        <Menu.Item
          disabled={boardData.columns.length === 1}
          onClick={() => {
            if (isSmartColumn) {
              updateLayers(
                {
                  layerKey: 'smartColumns',
                  layerData: boardData.layers.smartColumns.filter(
                    col => col._id !== _id,
                  ),
                },
                socket,
              );
              return;
            }
            const newBoardData = boardActions.removeColumn(_id);

            handleChange?.({
              changeTarget: 'column',
              targetId: _id,
              prevValue: prevColumnValue,
              newValue: findColumnById(_id, newBoardData),
              secondaryValue: {
                changeTarget: 'cells',
              },
            });
            setBoardData?.(newBoardData);
          }}
        >
          <MenuIcon
            style={{ color: Styles.red400 }}
            className="fal fa-times-circle"
          />
          Remove column
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.SubMenu title="Sort">
        <Menu.Item onClick={() => handleSortingChange()}>
          <MenuIcon
            style={{
              color: !columnSorting?.direction ? Styles.orange : Styles.dark400,
            }}
            className="fas fa-sort"
          />
          Default
        </Menu.Item>
        <Menu.Item onClick={() => handleSortingChange('asc')}>
          <MenuIcon
            style={{
              color:
                columnSorting?.direction === 'asc' ? Styles.orange : Styles.dark400,
            }}
            className="fas fa-sort-down"
          />
          A-Z
        </Menu.Item>
        <Menu.Item onClick={() => handleSortingChange('desc')}>
          <MenuIcon
            style={{
              color:
                columnSorting?.direction === 'desc' ? Styles.orange : Styles.dark400,
            }}
            className="fas fa-sort-up"
          />
          Z-A
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu title="Data type">
        {COLUMN_DATA_TYPES.map((type: DataTypes) => (
          <Menu.Item
            disabled={!typesAreCompatible(dataType, type)}
            onClick={() => {
              setBoardData?.(updateColumnById(_id, { dataType: type }, boardData));
            }}
            key={type}
          >
            <span style={{ fontWeight: type === dataType ? 'bold' : 'initial' }}>
              {type}
            </span>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu disabled={dataType === 'string'} title={<>Formatting</>}>
        {(dataType === 'number'
          ? NUMBER_FORMATS
          : dataType === 'date'
          ? DATE_FORMATS
          : []
        ).map((formatOpt: string) => (
          <Menu.Item
            key={formatOpt}
            onClick={() => {
              setBoardData?.(
                updateColumnById(
                  _id,
                  {
                    format: formatOpt as Formats,
                    formatSettings,
                  },
                  boardData,
                ),
              );
            }}
          >
            <span style={{ fontWeight: format === formatOpt ? 'bold' : 'initial' }}>
              {formatOpt}
            </span>
          </Menu.Item>
        ))}
        {dataType === 'number' && (
          <Menu.SubMenu title="Additional formats">
            <Menu.SubMenu title="Currencies">
              {CURRENCY_CODES.map(code => (
                <Menu.Item
                  key={code}
                  onClick={() => {
                    setBoardData?.(
                      updateColumnById(
                        _id,
                        {
                          format: 'currency',
                          formatSettings: {
                            ...formatSettings,
                            currencyCode: code,
                          },
                        },
                        boardData,
                      ),
                    );
                  }}
                >
                  <span
                    style={{
                      fontWeight:
                        code === formatSettings?.currencyCode ? 'bold' : 'initial',
                    }}
                  >
                    {code}
                  </span>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          </Menu.SubMenu>
        )}
      </Menu.SubMenu>
    </Menu>
  );

  const selectColumn = () =>
    setBoardState(
      R.pipe(
        R.assocPath(['columnsState', 'selectedColumn'], columnIndex),
        R.assocPath(['rowsState', 'selectedRow'], ''),
      )(boardState) as IBoardState,
    );

  return (
    <Dropdown
      trigger={['contextMenu']}
      onVisibleChange={toggleShowContextMenu}
      overlay={menu}
    >
      <ColumnHeaderContainer
        ref={colHeaderRef}
        onContextMenu={e => {
          e.preventDefault();
          toggleShowContextMenu(!showContextMenu);
          selectColumn();
        }}
        position={position}
        active={active}
        colWidth={colWidth ?? defaults.COL_WIDTH}
        onDoubleClick={() =>
          isSmartColumn
            ? undefined
            : setBoardState(
                R.assocPath(
                  ['columnsState', 'activeColumn'],
                  columnIndex,
                  boardState,
                ),
              )
        }
        onClick={selectColumn}
      >
        <Tooltip color="white" title={dataType}>
          {dataType === 'string' ? (
            <i className="fad fa-text-size" style={ColumnTypeStyle} />
          ) : dataType === 'number' ? (
            <i className="fad fa-hashtag" style={ColumnTypeStyle} />
          ) : dataType === 'date' ? (
            <i className="fad fa-calendar" style={ColumnTypeStyle} />
          ) : (
            <></>
          )}
        </Tooltip>

        {isSmartColumn && (
          <Tooltip color="white" title="Smart column">
            <i style={{ marginRight: '1rem' }} className="fad fa-network-wired" />
          </Tooltip>
        )}
        {isJoined && (
          <Tooltip color="white" title="Joined column">
            <i style={{ marginRight: '1rem' }} className="fad fa-code-merge" />
          </Tooltip>
        )}
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
            onChange={e => {
              prevValue.current = value;
              setBoardData!(
                R.assoc(
                  'columns',
                  returnUpdatedCells<IColumn>({
                    iterable: boardData.columns,
                    cellUpdates: [{ cellId: _id, updatedValue: e.target.value }],
                  }),
                  boardData,
                ),
              );
            }}
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
        <Dropdown disabled={showContextMenu} trigger={['click']} overlay={menu}>
          <MenuTrigger>
            <i className="fas fa-chevron-square-down" />
          </MenuTrigger>
        </Dropdown>
        <DraggableColEdge colWidth={colWidth ?? defaults.COL_WIDTH} colId={_id} />
      </ColumnHeaderContainer>
    </Dropdown>
  );
};

export default ColumnHeader;
