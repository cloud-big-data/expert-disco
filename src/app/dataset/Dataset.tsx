import InputField from 'components/ui/InputField';
import DatasetContext from 'contexts/DatasetContext';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { Helper } from 'components/ui/Typography';
import humanizeTimeAgo from 'utils/humanizeTimeAgo';
import Styles from 'styles/Styles';
import { IconButton } from 'components/ui/Buttons';
import Grid from './grid';
import getCellValueById from './lib/getCellValueById';
import editCellsAndReturnBoard from './lib/editCellsAndReturnBoard';
import DatasestToolbar from './toolbar';
import { initialBoardState } from './wrappers/DatasetWrapper';
import DatasetAggregates from './dataset_aggregates';

const DatasetContainer = styled.div<{ fullScreen: boolean }>`
  display: flex;
  flex-direction: column;
  position: sticky;
  overflow: hidden;
  padding: 1rem;
  max-height: calc(100% - 4rem);
  ${props => (props.fullScreen ? 'height: calc(100% - 4rem);' : '')};
  background: ${Styles.defaultBgColor};
`;

const MetaContainer = styled.div<{ fullScreen: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  padding: 0 2.25rem;
  .title__row {
    display: flex;
    width: 100%;
    align-items: flex-end;
    h5 {
      margin-bottom: 0;
    }
    button {
      margin-left: auto;
    }
  }
`;

const AggregatesContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem 2.25rem;
`;

const ParentGridContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: auto;
  padding-right: 2rem;
  background: ${Styles.defaultBgColor};
`;
const ToolbarContainer = styled.div`
  display: flex;
  padding: 1rem 2.25rem;
  position: sticky;
  top: 0;
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
  const [fullScreen, setFullScreen] = useState(false);
  const datasetRef = useRef<HTMLDivElement>(null);
  const {
    boardData,
    setBoardData,
    boardState,
    setBoardState,
    datasetMeta,
  } = useContext(DatasetContext)!;

  const { selectedCell } = boardState.cellsState;
  const inputRef = useRef<HTMLInputElement>(null);

  useHandleClickOutside(datasetRef, () => {
    setBoardState(initialBoardState);
  });

  return (
    <DatasetContainer fullScreen={fullScreen} ref={datasetRef}>
      {!fullScreen && (
        <AggregatesContainer>
          <DatasetAggregates />
        </AggregatesContainer>
      )}

      <MetaContainer fullScreen={fullScreen}>
        <div className="title__row">
          <h5>{datasetMeta.title}</h5>
          <IconButton onClick={() => setFullScreen(!fullScreen)}>
            {fullScreen ? (
              <i className="fas fa-compress-wide" />
            ) : (
              <i className="fas fa-expand-wide" />
            )}
          </IconButton>
        </div>
        {datasetMeta.createdAt && (
          <Helper>Created {humanizeTimeAgo(datasetMeta.createdAt)}</Helper>
        )}
      </MetaContainer>

      {!fullScreen && (
        <ToolbarContainer>
          <DatasestToolbar />
        </ToolbarContainer>
      )}
      <FormulaBarContainer>
        <InputField
          inputRef={inputRef}
          disabled={selectedCell === ''}
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
            setBoardData!(
              editCellsAndReturnBoard(
                [{ cellId: selectedCell, updatedValue: e.target.value }],
                boardData,
              ),
            )
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
