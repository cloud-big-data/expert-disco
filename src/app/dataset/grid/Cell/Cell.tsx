import DatasetContext from 'contexts/DatasetContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import editCellsAndReturnBoard from 'app/dataset/lib/editCellsAndReturnBoard';
import DropdownMenu from 'components/DropdownMenu';
import { notification } from 'antd';
import parseDataType from 'app/dataset/lib/parseDataType';
import GridContext from 'contexts/GridContext';
import usePrevious from 'hooks/usePrevious';
import formatValue from 'app/dataset/lib/formatValue';
import DatePicker from 'components/ui/DatePicker';
import {
  ICell,
  IBoardState,
  DataTypes,
  NumberFormatSettings,
  IColumn,
} from '../../types';
import { defaults } from '../constants';
import { ActiveInput } from '../styles';
import CellDisplay from './CellDisplay';

interface ICellProps extends ICell {
  rowId: string;
  highlighted: boolean;
  associatedColumn: IColumn;
  active: boolean;
  selected: boolean;
  position: {
    lastRow: boolean;
    lastColumn: boolean;
    firstColumn: boolean;
  };
  isCopying: boolean;
  colWidth?: number;
  colFormat?: any;
  additionalFormatKey?: string;
  formatSettings?: NumberFormatSettings;
}

const CELL_BORDER_COLOR = Styles.faintBorderColor;
const CELL_BORDER_RADIUS = '.2rem';

const CellContainer = React.memo(styled.div<{
  highlighted?: boolean;
  active?: boolean;
  selected?: boolean;
  position: ICellProps['position'];
  isCopying: boolean;
  width: number;
  isLoading: boolean;
}>`
  display: flex;
  align-items: center;
  color: ${Styles.dark400};
  height: 100%;
  width: ${props => props.width}px;
  max-width: ${props => props.width}px;
  background: white;
  overflow: hidden;
  padding: .5rem;
  cursor: pointer;
  flex: 1 0 auto;
  border-top: 1px solid ${CELL_BORDER_COLOR};
  border-left: 1px solid ${CELL_BORDER_COLOR};

  ${props =>
    props.position.lastRow
      ? `
      border-bottom: 1px solid ${CELL_BORDER_COLOR};
    `
      : ''}
  ${props =>
    props.position.lastColumn
      ? `
      border-left: 1px solid ${CELL_BORDER_COLOR};
      border-right: 2px solid ${CELL_BORDER_COLOR};
    `
      : ''}
  ${props =>
    props.position.lastRow && props.position.lastColumn
      ? `
      border-radius: 0 0 ${CELL_BORDER_RADIUS} 0;
    `
      : ''}

  ${props =>
    props.position.firstColumn
      ? `
      border-left: 2px solid ${CELL_BORDER_COLOR};
    `
      : ''}
  ${props =>
    props.position.lastRow && props.position.firstColumn
      ? `
      border-radius: 0 0 0 ${CELL_BORDER_RADIUS};
    `
      : ''}

  ${props =>
    props.selected
      ? `
    border: 2px solid ${Styles.purple400};
    border-radius: ${CELL_BORDER_RADIUS}; 
    box-shadow: ${Styles.smBoxShadow};
  `
      : ''}

  ${props =>
    props.active
      ? `
      box-shadow: ${Styles.smBoxShadow};
      `
      : ''}

  ${props =>
    props.highlighted
      ? `
    background: ${Styles.purple100};
  `
      : ''}

  ${props =>
    props.isCopying
      ? `
    border: 2px dashed ${Styles.purple400};
    border-radius: ${CELL_BORDER_RADIUS};
  `
      : ''}

  ${props =>
    props.isLoading
      ? `
      background: #f6f7f8;
      background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
      background-repeat: no-repeat;
      background-size: 800px 104px; 
      display: inline-block;
      position: relative; 
      -webkit-animation-duration: 1s;
      -webkit-animation-fill-mode: forwards; 
      -webkit-animation-iteration-count: infinite;
      -webkit-animation-name: placeholderShimmer;
      -webkit-animation-timing-function: linear;
      .cell__value,
      input {
        visibility: hidden;
      }
      
      `
      : ''}
`);

const showTypeError = (colDataType: DataTypes, attemptedType: DataTypes) => {
  notification.error({
    message: 'Invalid data type',
    description: `This column is of type ${colDataType}. Would you like to convert the column to type ${attemptedType}?`,
  });
};

const Cell: React.FC<ICellProps> = ({
  _id,
  value,
  highlighted,
  active,
  selected,
  position,
  isCopying,
  colWidth,
  colFormat,
  columnId,
  associatedColumn,
}) => {
  const {
    readOnly,
    boardState,
    setBoardState,
    boardData,
    setBoardData,
    setClipboard,
    loading,
  } = useContext(DatasetContext)!;
  const { handleChange } = useContext(GridContext)!;

  const [errorNotificationIsOpen, setErrorNotification] = useState(false);
  const [isSelected, setSelected] = useState(selected);

  const inputRef = useRef<HTMLInputElement>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const typingTimeout = useRef<any>(null);
  const initialValue = useRef(value);

  const prevActive = usePrevious(active);
  const associatedSmartColumn = associatedColumn.isSmartColumn
    ? boardData.layers.smartColumns.find(col => col._id === columnId)
    : undefined;

  const columnSettings = associatedColumn?.isSmartColumn
    ? associatedSmartColumn
    : associatedColumn?.isJoined
    ? boardData.layers.joins.condition
    : associatedColumn;

  const handleCopy = () => {
    setClipboard(
      formatValue({
        desiredFormat: columnSettings?.format,
        dataType: colDataType,
        value,
        formatSettings: columnSettings?.formatSettings,
      }),
    );
    setBoardState(R.set(R.lensPath(['cellsState', 'copyingCell']), _id, boardState));
  };

  const colDataType = associatedColumn?.dataType;

  const MENU_OPTIONS = [
    {
      label: 'copy',
      onClick: handleCopy,
      icon: <i className="fad fa-copy" />,
    },
    {
      label: 'paste',
      onClick: () => null,
      icon: <i className="far fa-paste" />,
    },
    {
      label: 'cut',
      onClick: () => null,
      icon: <i className="fad fa-cut" />,
    },
  ];

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (prevActive && !active) {
      handleChange?.({
        targetId: _id,
        changeTarget: 'cell',
        prevValue: initialValue.current,
        newValue: localValue,
      });
      initialValue.current = localValue;
    }
  });

  useEffect(() => {
    if (!selected && isSelected) {
      setSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [active]);

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setShowContextMenu(!showContextMenu);
    },
    [showContextMenu],
  );

  const handleClick = useCallback(() => {
    if (boardState.cellsState.selectedCell === _id) return;
    setSelected(true);

    setTimeout(() => {
      setBoardState(
        R.pipe(
          R.assocPath(['columnsState', 'selectedColumn'], -1),
          R.assocPath(['cellsState', 'activeCell'], -1),
          R.assocPath(['cellsState', 'selectedCell'], _id),
        )(boardState) as IBoardState,
      );
    });
  }, [_id, boardState, setBoardState]);

  const onDoubleClick = useCallback(() => {
    setBoardState(R.assocPath(['cellsState', 'activeCell'], _id, boardState));
  }, [_id, boardState, setBoardState]);

  return (
    <CellContainer
      width={colWidth ?? defaults.COL_WIDTH}
      isCopying={isCopying}
      active={active}
      highlighted={highlighted}
      position={position}
      selected={isSelected}
      isLoading={loading}
      onContextMenu={onContextMenu}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    >
      {!readOnly && active && !associatedColumn?.isSmartColumn ? (
        colDataType === 'date' ? (
          <DatePicker
            onChange={(date, dateString) =>
              setBoardData?.(
                editCellsAndReturnBoard(
                  [
                    {
                      cellId: _id,
                      updatedValue: dateString ?? '',
                    },
                  ],
                  boardData,
                ),
              )
            }
            value={value ? new Date(value) : undefined}
            bordered={false}
            format={colFormat ?? 'MM-DD-YYYY'}
          />
        ) : (
          <ActiveInput
            ref={inputRef}
            value={localValue ?? ''}
            type={colDataType === 'string' ? 'text' : 'number'}
            onKeyDown={e => {
              if (e.key !== 'Enter') return;
              const setCells = (key: string, value: any) =>
                R.over(R.lensProp('cellsState'), R.assoc(key, value));

              setBoardState(
                R.pipe(
                  setCells('activeCell', ''),
                  setCells('selectedCell', _id),
                )(boardState) as IBoardState,
              );
            }}
            onChange={e => {
              const { value } = e.target;
              const attemptedInputType = parseDataType(value);
              if (
                colDataType !== 'string' &&
                value !== '' &&
                attemptedInputType !== colDataType
              ) {
                if (!errorNotificationIsOpen) {
                  showTypeError(colDataType!, attemptedInputType);
                }
                setErrorNotification(true);
                setTimeout(() => {
                  setErrorNotification(false);
                }, 4500);
                return;
              }
              setLocalValue(e.target.value);
              clearTimeout(typingTimeout.current);

              typingTimeout.current = setTimeout(() => {
                setBoardData?.(
                  editCellsAndReturnBoard(
                    [
                      {
                        cellId: _id,
                        updatedValue: (value as string) ?? '',
                      },
                    ],
                    boardData,
                  ),
                );
              }, 200);
            }}
          />
        )
      ) : (
        <CellDisplay
          format={columnSettings?.format}
          formatSettings={columnSettings?.formatSettings}
          colDataType={colDataType}
          value={value}
        />
      )}
      {showContextMenu && (
        <DropdownMenu
          closeMenu={() => setShowContextMenu(false)}
          options={MENU_OPTIONS}
        />
      )}
    </CellContainer>
  );
};

export default Cell;
