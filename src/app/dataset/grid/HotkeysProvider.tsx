import React, { useEffect, useRef, useState } from 'react';
import { IBoardData, IBoardState, IRow } from 'app/dataset/types';
import * as R from 'ramda';
import returnUpdatedCells from 'app/dataset/lib/returnUpdatedCells';
import useClippy from 'use-clippy';
import getCellValueById from '../lib/getCellValueById';

const HotkeysProvider: React.FC<{
  boardState: IBoardState;
  setBoardState: (boardState: IBoardState) => void;
  boardData: IBoardData;
  setBoardData: (boardData: IBoardData) => void;
}> = ({ boardState, setBoardState, boardData, setBoardData, children }) => {
  const [clipboard, setClipboard] = useClippy();
  const [, toggleCut] = useState<{ cellId?: string; cutting: boolean }>({
    cutting: false,
  });
  const keysPressed = useRef<string[]>([]);
  const setKeysPressed = (keys: string[]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    keysPressed.current = [...new Set(keys)];
  };
  const { selectedCell } = boardState.cellsState;

  const checkKeyEvent = (e: KeyboardEvent) =>
    ['Meta', 'c', 'v', 'x'].includes(e.key);

  const has = (key: string) => keysPressed.current.includes(key);

  useEffect(() => {
    const handleCopy = () => {
      const setCopiedCell = (selectedCell: string) => {
        setBoardState({
          ...boardState,
          cellsState: {
            ...boardState.cellsState,
            copyingCell: selectedCell,
          },
        });
      };

      setClipboard(getCellValueById(boardData.rows, selectedCell));
      setCopiedCell(selectedCell);
    };

    const handlePaste = () => {
      const pasteClipboard = (targetCell: string) => {
        setBoardData({
          ...boardData,
          rows: R.map((row: IRow) => ({
            ...row,
            cells: returnUpdatedCells({
              iterable: row.cells,
              cellId: targetCell,
              updatedValue: clipboard,
            })!,
          }))(boardData.rows),
        });
      };

      pasteClipboard(selectedCell);
      setBoardState({
        ...boardState,
        cellsState: {
          ...boardState.cellsState,
          copyingCell: '',
        },
      });
      // if (cut.cutting) {
      //   setBoardData({
      //     ...boardData,
      //     rows: R.map((row: IRow) => ({
      //       ...row,
      //       cells: returnUpdatedCells({
      //         iterable: row.cells,
      //         cellId: cut.cellId!,
      //         updatedValue: '',
      //       })!,
      //     }))(boardData.rows),
      //   });
      // }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (!checkKeyEvent(e)) return;
      if (selectedCell === '') return;
      setKeysPressed([...keysPressed.current, e.key]);

      if (has('c') && has('Meta')) {
        handleCopy();
      }
      if (has('x') && has('Meta')) {
        toggleCut({
          cellId: selectedCell,
          cutting: true,
        });
        handleCopy();
      } else {
        toggleCut({
          cutting: false,
        });
      }
      if (has('v') && has('Meta')) {
        handlePaste();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!checkKeyEvent(e)) return;
      setKeysPressed([]);
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    boardData,
    boardState,
    clipboard,
    keysPressed,
    selectedCell,
    setBoardData,
    setBoardState,
    setClipboard,
  ]);

  return <>{children}</>;
};

export default HotkeysProvider;
