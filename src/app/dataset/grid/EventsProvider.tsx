import React, { useEffect } from 'react';
import findCellCoordinates from '../lib/findCellIndex';
import { IBoardData, IBoardState } from '../types';

const EventsProvider: React.FC<{
  boardState: IBoardState;
  boardData: IBoardData;
  setBoardState: (state: IBoardState) => void;
}> = ({
  boardState,
  setBoardState,
  boardData,
  children
}) => {
  const { selectedCell, activeCell } = boardState.cellsState;
  const [rowIndex, cellIndex] = selectedCell ? findCellCoordinates(boardData.rows, selectedCell) : [];
  const cellLength = boardData.rows[0].cells.length;
  const rowLength = boardData.rows.length;

  const getCellId = (rowIndex: number, cellIndex: number) =>
    boardData.rows[rowIndex].cells[cellIndex]._id

  const handleTab = () => {
    const getNextHorizontalCell = () => {
      if (cellIndex + 1 === cellLength) {
        if (rowIndex + 1 === rowLength) {
          return getCellId(0, 0);
        } else {
          return getCellId(rowIndex + 1, 0);
        }
      }
  
      return getCellId(rowIndex, cellIndex + 1);
    }

    setBoardState({
      ...boardState,
      cellsState: {
        ...boardState.cellsState,
        activeCell: '',
        selectedCell: getNextHorizontalCell(),
      }
    })
  }

  const handleEnter = () => {
    if (activeCell === '') {
      setBoardState({
        ...boardState,
        cellsState: {
          ...boardState.cellsState,
          activeCell: selectedCell,
        }
      })
      return;
    }
    
    const getNextVerticalCell = () => {
      if (rowIndex + 1 === rowLength) {
        if (cellIndex + 1 === cellLength) {
          return getCellId(0, 0);
        } else {
          return getCellId(0, cellIndex + 1);
        }
      }
      
      return getCellId(rowIndex + 1, cellIndex);
    }

    setBoardState({
      ...boardState,
      cellsState: {
        ...boardState.cellsState,
        selectedCell: getNextVerticalCell(),
        activeCell: '',
      }
    })
  }

  const handleArrowKey = (key: string) => {
    let getNext = () => '';
    switch (key) {
      case 'ArrowRight':
        getNext = () => {
          if (cellIndex + 1 === cellLength) {
            if (rowIndex + 1 === rowLength) {
              return getCellId(0, 0);
            }
            return getCellId(rowIndex + 1, 0);
          }
          else {
            return getCellId(rowIndex, cellIndex + 1);
          }
        }
        break
      case 'ArrowLeft':
        getNext = () => {
          if (cellIndex === 0) {
            if (rowIndex === 0) {
              return getCellId(rowIndex, cellIndex);
            }
            return getCellId(rowIndex - 1, cellLength - 1);
          }
          else {
            return getCellId(rowIndex, cellIndex - 1);
          }
        }
        break
      case 'ArrowUp':
        getNext = () => {
          if (rowIndex === 0) {
            if (cellIndex === 0) {
              return getCellId(rowIndex, cellIndex);
            } else {
              return getCellId(rowLength - 1, cellIndex - 1);
            }
          } else {
            return getCellId(rowIndex - 1, cellIndex);
          }
        }
        break
      case 'ArrowDown':
        getNext = () => {
          if (rowIndex + 1 === rowLength) {
            if (cellIndex + 1 === cellLength) {
              return getCellId(rowIndex, cellIndex);
            } else {
              return getCellId(0, cellIndex + 1);
            }
          } else {
            return getCellId(rowIndex + 1, cellIndex);
          }
        }
    }

    setBoardState({
      ...boardState,
      cellsState: {
        ...boardState.cellsState,
        activeCell: '',
        selectedCell: getNext(),
      }
    })
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    const { key } = e;
    if (!['Tab', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(key)) return;

    const propertiesToActOn: Array<{
      key: string;
      prop: any;
    }> = [
      {
        key: 'cell',
        prop: boardState.cellsState.selectedCell,
      },
      {
        key: 'activeCell',
        prop: boardState.cellsState.activeCell,
      },
      {
        key: 'column',
        prop: boardState.columnsState.selectedColumn,
      }
    ]

    const triggeredProperty = propertiesToActOn.find(x => x.prop && ![-1, ''].includes(x.prop));
    if (!triggeredProperty) return;
    
    switch (key) {
      case 'Tab':
        e.preventDefault();
        handleTab();
        break
      case 'Enter':
        e.preventDefault();
        handleEnter();
        break
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowDown':
        if (activeCell === '') {
          e.preventDefault();
          handleArrowKey(key);
        }
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  })

  return (
    <React.Fragment>
      { children }
    </React.Fragment>
  )
}

export default EventsProvider;