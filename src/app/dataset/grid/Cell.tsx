import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import returnUpdatedCells from '../lib/returnUpdatedCells';
import { ICell, IRow } from '../types';
import { defaults } from './constants';
import { ActiveInput } from './styles';
import * as R from 'ramda';

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
}

const CellContainer = styled.div<{
  highlighted?: boolean;
  active?: boolean;
  selected?: boolean;
  position: ICellProps['position'];
}>`
  display: flex;
  align-items: center;
  height: 100%;
  width: ${defaults.COL_WIDTH}rem;
  padding: .5rem;

  border-top: 2px solid ${Styles.faintBorderColor};
  border-left: 2px solid ${Styles.faintBorderColor};
  ${props =>
    props.position.lastRow ? `
      border-bottom: 2px solid ${Styles.faintBorderColor};
    ` : ''
  }
  ${props =>
    props.position.lastColumn ? `
      border-left: 1px solid ${Styles.faintBorderColor};
      border-right: 2px solid ${Styles.faintBorderColor};
    ` : ''
  }
  ${props =>
    props.position.lastRow && props.position.lastColumn ? `
      border-radius: 0 0 ${Styles.defaultBorderRadius} 0;
    ` : ''
  }

  ${props =>
    props.position.lastRow && props.position.firstColumn ? `
      border-radius: 0 0 0 ${Styles.defaultBorderRadius};
    ` : ''
  }

  ${props => props.selected ? `
    border: 2px solid ${Styles.purple};
    border-radius: ${Styles.defaultBorderRadius};
  ` : ''}

  ${props => props.highlighted ? `
    background: ${Styles.purpleAccent};
  ` : ''}
`;

const Cell: React.FC<ICellProps> = ({
  _id,
  value,
  highlighted,
  active,
  selected,
  position,
}) => {
  const { boardState, setBoardState, boardData, setBoardData } = useContext(DatasetContext)!;
  const inputRef = useRef<HTMLInputElement>(null);
  const { cellsState } = boardState;

  useEffect(() => {
    inputRef.current?.focus();
  }, [active])

  return (
    <CellContainer
      active={active}
      highlighted={highlighted}
      position={position}
      selected={selected}
      onClick={() => setBoardState({
        ...boardState,
        cellsState: {
          ...cellsState,
          selectedCell: _id
        }
      })}
      onDoubleClick={() => setBoardState({
        ...boardState,
        cellsState: {
          ...cellsState,
          activeCell: _id
        }
      })}
      data-cellId={_id}
    >
      {active ? (
        <ActiveInput
          ref={inputRef}
          value={value as string ?? ''}
          type="text"
          onKeyDown={e => {
            if (e.key === 'Enter') setBoardState({
              ...boardState,
              cellsState: {
                ...boardState.cellsState,
                activeCell: '',
              }
            })
          }}
          onChange={e => setBoardData!({
              ...boardData,
              rows: R.map(
                (row: IRow) => ({
                    ...row,
                    cells: returnUpdatedCells({
                      iterable: row.cells,
                      cellId: _id,
                      updatedValue: e.target.value,
                    })!
                  })
                )(boardData.rows)
            })
          }
        />
      ) : (
        value
      )}
    </CellContainer>
  );
}

export default Cell;