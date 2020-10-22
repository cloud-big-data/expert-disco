import React, { useRef, useState } from 'react';
import hotkeys from 'hotkeys-js';
import { IBoardData, IBoardState, IRow } from 'app/dataset/types';
import * as R from 'ramda';
import returnUpdatedCells from 'app/dataset/lib/returnUpdatedCells';
import useClippy from 'use-clippy';

const CellEventsProvider: React.FC<{
  hiddenInputRef: React.RefObject<HTMLInputElement>;
  isCopying: boolean;
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
  boardData: IBoardData;
  setBoardData: (boardData: IBoardData) => void;
  value: string | number | null;
  _id: string;
}> = ({
  hiddenInputRef,
  isCopying,
  boardState,
  setBoardState,
  boardData,
  setBoardData,
  _id,
  value,
  children,
 }) => {
  const [clipboard, setClipboard] = useClippy();

  const copyKeys = ['cmd+c', 'ctrl+c'];
  copyKeys.forEach(key => {
    hotkeys(key, () => {
      if (_id === boardState.cellsState.selectedCell) {
        setClipboard(value?.toString() ?? '');
        // setBoardState({
        //   ...boardState,
        //   cellsState: {
        //     ...boardState.cellsState,
        //     copyingCell: _id,
        //   }
        // })
      }
    })
  })

  const pasteKeys = ['cmd+v', 'ctrl+v'];
  pasteKeys.forEach(key => {
    hotkeys(key, () => {
      if (_id !== boardState.cellsState.selectedCell) return;
      setBoardData({
        ...boardData,
        rows: R.map(
          (row: IRow) => ({
              ...row,
              cells: returnUpdatedCells({
                iterable: row.cells,
                cellId: _id,
                updatedValue: clipboard,
              })!
            })
          )(boardData.rows)
      })
    })
  })


  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}

export default CellEventsProvider;