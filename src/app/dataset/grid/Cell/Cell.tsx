import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import editCellsAndReturnBoard from 'app/dataset/lib/editCellsAndReturnBoard';
import { ICell, IBoardState } from '../../types';
import { defaults } from '../constants';
import { ActiveInput } from '../styles';

interface ICellProps extends ICell {
  rowId: string;
  highlighted: boolean;
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

const CellContainer = styled.div<{
  highlighted?: boolean;
  active?: boolean;
  selected?: boolean;
  position: ICellProps['position'];
  isCopying: boolean;
  width: number;
}>`
  display: flex;
  align-items: center;
  height: 100%;
  width: ${props => props.width}px;
  max-width: ${props => props.width}px;
  overflow: hidden;
  padding: .5rem;
  cursor: pointer;
  flex: 1 0 auto;

  border-top: 2px solid ${Styles.faintBorderColor};
  border-left: 2px solid ${Styles.faintBorderColor};
  ${props =>
    props.position.lastRow
      ? `
      border-bottom: 2px solid ${Styles.faintBorderColor};
    `
      : ''}
  ${props =>
    props.position.lastColumn
      ? `
      border-left: 1px solid ${Styles.faintBorderColor};
      border-right: 2px solid ${Styles.faintBorderColor};
    `
      : ''}
  ${props =>
    props.position.lastRow && props.position.lastColumn
      ? `
      border-radius: 0 0 ${Styles.defaultBorderRadius} 0;
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
    border: 2px solid ${Styles.purple};
    border-radius: ${Styles.defaultBorderRadius};
  `
      : ''}

  ${props =>
    props.highlighted
      ? `
    background: ${Styles.purpleAccent};
  `
      : ''}

  ${props =>
    props.isCopying
      ? `
    border: 2px dashed ${Styles.purple};
    border-radius: ${Styles.defaultBorderRadius};
  `
      : ''}
`;

const Cell: React.FC<ICellProps> = ({
  _id,
  value,
  highlighted,
  active,
  selected,
  position,
  isCopying,
  colWidth,
}) => {
  const { boardState, setBoardState, boardData, setBoardData } = useContext(
    DatasetContext,
  )!;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [active]);

  return (
    <CellContainer
      width={colWidth ?? defaults.COL_WIDTH}
      isCopying={isCopying}
      active={active}
      highlighted={highlighted}
      position={position}
      selected={selected}
      onClick={() =>
        setBoardState(
          R.pipe(
            R.assocPath(['columnsState', 'selectedColumn'], -1),
            R.assocPath(['cellsState', 'selectedCell'], _id),
          )(boardState) as IBoardState,
        )
      }
      onDoubleClick={() =>
        setBoardState(R.assocPath(['cellsState', 'activeCell'], _id, boardState))
      }
    >
      {active ? (
        <ActiveInput
          ref={inputRef}
          value={(value as string) ?? ''}
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
            setBoardData!(
              editCellsAndReturnBoard(
                [
                  {
                    cellId: _id,
                    updatedValue: e.target.value,
                  },
                ],
                boardData,
              ),
            );
          }}
        />
      ) : (
        value
      )}
    </CellContainer>
  );
};

export default Cell;
