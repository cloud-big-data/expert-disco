import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { Helper } from 'components/ui/Typography';
import humanizeTimeAgo from 'utils/humanizeTimeAgo';
import Styles from 'styles/Styles';
import { IconButton } from 'components/ui/Buttons';
import * as R from 'ramda';
import useFindVisibleRows from 'hooks/useFindVisibleRows';
import { v4 as uuidv4 } from 'uuid';
import Grid from './grid';
import DatasetToolbar from './toolbar';
import DatasetAggregates from './dataset_aggregates';
import { ChangeHistoryItem, IBoardData } from './types';

const DatasetContainer = styled.div<{ fullScreen: boolean }>`
  display: flex;
  position: sticky;
  flex-direction: column;
  padding: 1rem;
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
`;

const Dataset: React.FC<{
  readOnly?: boolean;
}> = ({ readOnly }) => {
  const [fullScreen, setFullScreen] = useState(false);

  const datasetRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { datasetHead, socket, changeHistoryRef } = useContext(DatasetContext)!;
  const currentVersionRef = useRef<string | undefined>(
    changeHistoryRef.current?.[changeHistoryRef.current.length - 1],
  );

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }, []);

  const { boardData, setBoardData, getRowSlice } = useContext(DatasetContext)!;
  const [firstVisibleRow, lastVisibleRow, isScrolling] = useFindVisibleRows(
    gridRef,
    {
      first: boardData.rows[0]?.index ?? 0,
      last: R.last(boardData.rows)?.index ?? 100,
    },
  );

  useEffect(() => {
    if (isScrolling) {
      getRowSlice(firstVisibleRow, lastVisibleRow);
    }
  }, [firstVisibleRow, getRowSlice, isScrolling, lastVisibleRow]);

  const changeHistory = changeHistoryRef.current;
  const currentVersion = currentVersionRef.current;

  const undo = () => {
    const currentVersionIndex = changeHistory?.findIndex(
      id => id === currentVersion,
    );
    if (currentVersionIndex === -1 || !changeHistory?.[currentVersionIndex - 1]) {
      return;
    }

    const nextVersion = changeHistory[currentVersionIndex - 1];
    socket?.emit('checkoutToVersion', {
      versionId: nextVersion,
      start: firstVisibleRow,
      end: lastVisibleRow,
    });
  };

  const redo = () => {
    const currentVersionIndex = changeHistory?.findIndex(
      id => id === currentVersion,
    );
    if (currentVersionIndex === -1 || !changeHistory?.[currentVersionIndex + 1]) {
      return;
    }
    const nextVersion = changeHistory[currentVersionIndex + 1];
    socket?.emit('checkoutToVersion', {
      versionId: nextVersion,
      start: firstVisibleRow,
      end: lastVisibleRow,
    });
  };

  const handleChange = (changeHistoryItem: ChangeHistoryItem) => {
    console.log(changeHistoryItem);
    socket?.emit('saveToHistory', {
      ...changeHistoryItem,
      revisionId: uuidv4(),
    });
  };

  return (
    <DatasetContainer fullScreen={fullScreen} ref={datasetRef}>
      {!fullScreen && (
        <AggregatesContainer>
          <DatasetAggregates />
        </AggregatesContainer>
      )}

      <MetaContainer fullScreen={fullScreen}>
        <div className="title__row">
          <h5>{datasetHead.title}</h5>
          <IconButton onClick={() => setFullScreen(!fullScreen)}>
            {fullScreen ? (
              <i className="fas fa-compress-wide" />
            ) : (
              <i className="fas fa-expand-wide" />
            )}
          </IconButton>
        </div>
        {datasetHead.createdAt && (
          <Helper>Created {humanizeTimeAgo(datasetHead.createdAt)}</Helper>
        )}
      </MetaContainer>

      {!fullScreen && !readOnly && (
        <ToolbarContainer>
          <DatasetToolbar undo={undo} redo={redo} />
        </ToolbarContainer>
      )}
      <ParentGridContainer>
        <Grid
          undo={undo}
          redo={redo}
          gridRef={gridRef}
          visibleRows={[firstVisibleRow, lastVisibleRow]}
          handleChange={handleChange}
        />
      </ParentGridContainer>
    </DatasetContainer>
  );
};
export default Dataset;
