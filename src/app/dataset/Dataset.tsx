import InputField from 'components/ui/InputField';
import DatasetContext from 'contexts/DatasetContext';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/macro';
import Grid from './grid';
import getCellValueById from './lib/getCellValueById';
import returnUpdatedCells from './lib/returnUpdatedCells';
import DatasestToolbar from './toolbar';
import { initialBoardState } from './wrappers/DatasetWrapper';

const DatasetContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  max-height: 90vh;
  min-height: 90vh;
  overflow: hidden;
  padding: 1rem;
`;
const ParentGridContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: auto;
  padding-right: 2rem;
`;
const ToolbarContainer = styled.div`
  display: flex;
  padding: 1rem 2.25rem;
`;
const FormulaBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 2.25rem;
`;

const Dataset: React.FC<{
  readOnly?: boolean;
}> = () => {
  const datasetRef = useRef<HTMLDivElement>(null);
  const { boardData, setBoardData, boardState, setBoardState } = useContext(
    DatasetContext,
  )!;
  const { selectedCell } = boardState.cellsState;
  const inputRef = useRef<HTMLInputElement>(null);

  useHandleClickOutside(datasetRef, () => {
    setBoardState(initialBoardState);
  });

  return (
    <DatasetContainer ref={datasetRef}>
      <ToolbarContainer>
        <DatasestToolbar />
      </ToolbarContainer>
      <FormulaBarContainer>
        <InputField
          inputRef={inputRef}
          value={
            selectedCell !== '' ? getCellValueById(boardData.rows, selectedCell) : ''
          }
          onFocus={() =>
            setBoardState({ ...boardState, formulaBar: { active: true } })
          }
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setBoardState({ ...boardState, formulaBar: { active: false } });
              inputRef.current?.blur();
            }
          }}
          onChange={e =>
            setBoardData!({
              ...boardData,
              rows: boardData.rows.map(row => ({
                ...row,
                cells: returnUpdatedCells({
                  iterable: row.cells,
                  cellUpdates: [
                    { cellId: selectedCell, updatedValue: e.target.value },
                  ],
                }),
              })),
            })
          }
          icon={<i className="fad fa-function" />}
        />
      </FormulaBarContainer>
      <ParentGridContainer>
        <Grid />
      </ParentGridContainer>
    </DatasetContainer>
  );
};
export default Dataset;
