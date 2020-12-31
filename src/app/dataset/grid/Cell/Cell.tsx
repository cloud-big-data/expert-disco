import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import editCellsAndReturnBoard from 'app/dataset/lib/editCellsAndReturnBoard';
import DropdownMenu from 'components/DropdownMenu';
import useClippy from 'use-clippy';
import getCellValueById from 'app/dataset/lib/getCellValueById';
import { notification } from 'antd';
import parseDataType from 'app/dataset/lib/parseDataType';
import GridContext from 'contexts/GridContext';
import usePrevious from 'hooks/usePrevious';
import { ICell, IBoardState, DataTypes } from '../../types';
import { defaults } from '../constants';
import { ActiveInput } from '../styles';

interface ICellProps extends ICell {
  rowId: string;
  highlighted: boolean;
  colIndex: number;
  active: boolean;
  selected: boolean;
  position: {
    lastRow: boolean;
    lastColumn: boolean;
    firstColumn: boolean;
  };
  isCopying: boolean;
  colWidth?: number;
}

const CELL_BORDER_COLOR = Styles.faintBorderColor;
const CellContainer = styled.div<{
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
      border-radius: 0 0 ${Styles.defaultBorderRadius} 0;
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
      border-radius: 0 0 0 ${Styles.defaultBorderRadius};
    `
      : ''}

  ${props =>
    props.selected
      ? `
    border: 2px solid ${Styles.purple400};
    border-radius: ${Styles.defaultBorderRadius}; 
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
    border-radius: ${Styles.defaultBorderRadius};
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
`;

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
  colIndex,
}) => {
  const [, setClipboard] = useClippy();
  const {
    readOnly,
    boardState,
    setBoardState,
    boardData,
    setBoardData,
  } = useContext(DatasetContext)!;
  const { handleChange } = useContext(GridContext)!;

  const [errorNotificationIsOpen, setErrorNotification] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const typingTimeout = useRef<any>(null);

  const prevActive = usePrevious(active);

  useEffect(() => {
    inputRef.current?.focus();
  }, [active]);

  const handleCopy = () => {
    setClipboard(getCellValueById(boardData.rows, _id));
    setBoardState(R.set(R.lensPath(['cellsState', 'copyingCell']), _id, boardState));
  };

  const colDataType = boardData.columns.find((col, index) => index === colIndex)
    ?.dataType;

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
    if (prevActive && !active) {
      handleChange?.({
        targetId: _id,
        changeTarget: 'cell',
        prevValue: value,
        newValue: localValue,
      });
    }
  });

  return (
    <CellContainer
      width={colWidth ?? defaults.COL_WIDTH}
      isCopying={isCopying}
      active={active}
      highlighted={highlighted}
      position={position}
      selected={selected}
      isLoading={false} // Add a smoother loading experience later
      onContextMenu={e => {
        e.preventDefault();
        setShowContextMenu(!showContextMenu);
      }}
      onClick={() => {
        setBoardState(
          R.pipe(
            R.assocPath(['columnsState', 'selectedColumn'], -1),
            R.assocPath(['cellsState', 'selectedCell'], _id),
          )(boardState) as IBoardState,
        );
      }}
      onDoubleClick={() =>
        setBoardState(R.assocPath(['cellsState', 'activeCell'], _id, boardState))
      }
    >
      {!readOnly && active ? (
        <ActiveInput
          ref={inputRef}
          value={localValue ?? ''}
          type="text"
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
      ) : (
        <span className="cell__value">{value}</span>
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
