import DatasetContext from 'contexts/DatasetContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { Helper } from 'components/ui/Typography';
import humanizeTimeAgo from 'utils/humanizeTimeAgo';
import Styles from 'styles/Styles';
import { IconButton } from 'components/ui/Buttons';
import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'components/ui/Modal';
import Grid from './grid';
import DatasetToolbar from './toolbar';
import DatasetAggregates from './dataset_aggregates';
import { ChangeHistoryItem } from './types';
import DatasetMetaEditor from './toolbar/DatasetMetaEditor';

const DatasetContainer = styled.div<{ fullScreen: boolean }>`
  display: flex;
  position: sticky;
  flex-direction: column;
  padding: 1rem;
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
    .title__container {
      display: flex;
      align-items: center;
      h5 {
        margin-bottom: 0;
        margin-right: 0.5rem;
      }
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
  const { datasetHead, socket, changeHistoryRef, visibleRows } = useContext(
    DatasetContext,
  )!;

  const [firstVisibleRow, lastVisibleRow] = visibleRows;
  const [metaEditorOpen, setMetaEditorOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string | undefined>(
    changeHistoryRef.current?.[changeHistoryRef.current.length - 1],
  );

  const datasetRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentVersion && changeHistoryRef.current[0]) {
      setCurrentVersion(changeHistoryRef.current[0]);
    }
  }, [currentVersion, changeHistoryRef]);

  const undo = useCallback(() => {
    const currentIndex = changeHistoryRef.current?.findIndex(
      id => id === currentVersion,
    );
    if (currentIndex === -1 || currentIndex === 0) return;

    const targetVersionId = changeHistoryRef.current[currentIndex];

    socket?.emit('checkoutToVersion', {
      versionId: targetVersionId,
      start: firstVisibleRow,
      end: lastVisibleRow,
      direction: 'undo',
    });

    setCurrentVersion(changeHistoryRef.current[currentIndex - 1]);
  }, [changeHistoryRef, currentVersion, firstVisibleRow, lastVisibleRow, socket]);

  const redo = useCallback(() => {
    const currentIndex = changeHistoryRef.current?.findIndex(
      id => id === currentVersion,
    );
    if (currentIndex === -1) return;

    const targetVersionId = changeHistoryRef.current[currentIndex + 1];
    const nextId = changeHistoryRef.current[currentIndex + 1];
    if (!nextId) return;
    if (!targetVersionId) return;

    socket?.emit('checkoutToVersion', {
      versionId: targetVersionId,
      start: firstVisibleRow,
      end: lastVisibleRow,
      direction: 'redo',
    });

    setCurrentVersion(nextId);
  }, [changeHistoryRef, currentVersion, firstVisibleRow, lastVisibleRow, socket]);

  const handleChange = useCallback(
    (changeHistoryItem: ChangeHistoryItem) => {
      if (R.equals(changeHistoryItem.newValue, changeHistoryItem.prevValue)) return;

      const revisionId = uuidv4();
      const currentIndex = changeHistoryRef.current?.findIndex(
        id => id === currentVersion,
      );

      const shouldRevert = currentIndex !== changeHistoryRef.current?.length - 1;

      if (shouldRevert && changeHistoryRef.current) {
        changeHistoryRef.current = [
          ...changeHistoryRef.current.slice(0, currentIndex + 1),
          revisionId,
        ];
      } else {
        changeHistoryRef.current = [...changeHistoryRef.current, revisionId];
      }

      localStorage.setItem(
        `${datasetHead._id}-change-history`,
        JSON.stringify(changeHistoryRef.current),
      );
      socket?.emit('saveToHistory', {
        ...changeHistoryItem,
        revisionId,
        revert: shouldRevert,
        timestamp: Date.now(),
      });
      setCurrentVersion(revisionId);
    },
    [changeHistoryRef, currentVersion, datasetHead._id, socket],
  );

  return (
    <DatasetContainer fullScreen={fullScreen} ref={datasetRef}>
      {!fullScreen && (
        <AggregatesContainer>
          <DatasetAggregates />
        </AggregatesContainer>
      )}

      {metaEditorOpen && (
        <Modal closeModal={() => setMetaEditorOpen(false)}>
          <DatasetMetaEditor datasetHead={datasetHead} />
        </Modal>
      )}
      <MetaContainer fullScreen={fullScreen}>
        <div className="title__row">
          <div className="title__container">
            <h5>{datasetHead.title}</h5>
            <IconButton onClick={() => setMetaEditorOpen(true)}>
              <i className="fad fa-edit" />
            </IconButton>
          </div>
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
          <DatasetToolbar currentVersion={currentVersion} undo={undo} redo={redo} />
        </ToolbarContainer>
      )}
      <ParentGridContainer>
        <Grid
          undo={undo}
          redo={redo}
          gridRef={gridRef}
          handleChange={handleChange}
        />
      </ParentGridContainer>
    </DatasetContainer>
  );
};
export default Dataset;
