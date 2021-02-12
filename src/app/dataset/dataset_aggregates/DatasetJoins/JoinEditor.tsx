import { IJoinLayer, IServerDataset } from 'app/dataset/types';
import ConfirmationContainer from 'components/ConfirmationButtons';
import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import Select from 'components/ui/Select';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { FC, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import skyvueFetch from 'services/skyvueFetch';

import * as R from 'ramda';

import styled from 'styled-components/macro';
import { Label } from 'components/ui/Typography';
import Separator from 'components/Separator';
import { Checkbox } from 'antd';

const EditorContainer = styled.div`
  .conditions__container {
    display: grid;
    grid-template-columns: repeat(2, 2fr);
    column-gap: 1rem;
  }

  .column-selection__container {
    display: grid;
    grid-template-areas: 'a a';
  }
`;

const JoinEditor: FC<{
  unsavedChanges: boolean;
  setUnsavedChanges: (changes: boolean) => void;
  joinState: Partial<IJoinLayer>;
  setJoinState: (state: Partial<IJoinLayer>) => void;
}> = ({ unsavedChanges, setUnsavedChanges, joinState, setJoinState }) => {
  const { condition } = joinState;

  const { datasetHead, boardData, socket, queriedDatasets } = useContext(
    DatasetContext,
  )!;
  const { accessToken } = useContext(UserContext)!;
  const { error, isLoading, ...availableDatasets } = useQuery<IServerDataset[]>(
    joinState.condition?.datasetId,
    () => skyvueFetch(accessToken).get(`/datasets`),
  );

  const selectedDataset = availableDatasets.data?.find(
    dataset => dataset._id === condition?.datasetId,
  );

  const joiningDataset = queriedDatasets.find(
    dataset =>
      dataset._id === condition?.datasetId &&
      dataset.layers?.joins?.condition?.datasetId !== datasetHead?._id,
  );

  const joinableColumns = joiningDataset?.columns.filter(
    col => col.isUnique === true,
  );

  const updateJoinOn = (colId: string, key: string) => {
    setUnsavedChanges(true);
    setJoinState(
      R.assocPath(
        ['condition', 'on'],
        key === 'mainColumnId'
          ? [
              {
                mainColumnId: colId,
                joinedColumnId: condition?.on[0]?.joinedColumnId ?? '',
              },
            ]
          : [
              {
                mainColumnId: condition?.on[0]?.mainColumnId ?? '',
                joinedColumnId: colId,
              },
            ],
        joinState,
      ),
    );
  };

  useEffect(() => {
    if (condition && condition.datasetId && !joiningDataset) {
      socket?.emit('queryBoardHeaders', condition.datasetId);
    }
  }, [condition, joiningDataset, socket]);

  return (
    <EditorContainer>
      <Label>Select a dataset to join</Label>
      <Select
        value={condition?.datasetId}
        placeholder="Select a dataset to join"
        onChange={e => {
          if (e === 'none') {
            setJoinState({});
            socket?.emit('layer', { layerKey: 'joins', layerData: {} });
            return;
          }
          socket?.emit('queryBoardHeaders', e);
          setJoinState(R.assocPath(['condition', 'datasetId'], e, joinState));
          setUnsavedChanges(true);
        }}
        options={
          isLoading
            ? []
            : [
                { name: "Don't join this dataset", value: 'none' },
                ...(
                  availableDatasets.data?.filter(
                    dataset => dataset._id !== datasetHead._id,
                  ) ?? []
                ).map(dataset => ({
                  name: dataset.title,
                  value: dataset._id,
                })),
              ]
        }
      />
      {selectedDataset && (
        <>
          <Separator />
          <div className="conditions__container">
            <div>
              <Label>Join where this column from {datasetHead.title}</Label>
              <Select
                value={condition?.on[0]?.mainColumnId}
                onChange={e => updateJoinOn(e, 'mainColumnId')}
                options={
                  boardData.columns.map(col => ({
                    name: col.value ?? col._id,
                    value: col._id,
                  })) ?? []
                }
              />
            </div>
            <div>
              <Label>
                Equals this column from{' '}
                {selectedDataset?.title ?? 'the joined dataset'}
              </Label>
              <Select
                value={condition?.on[0]?.joinedColumnId}
                onChange={e => updateJoinOn(e, 'joinedColumnId')}
                options={
                  joinableColumns?.map(col => ({
                    name: col.value ?? col._id,
                    value: col._id,
                  })) ?? []
                }
              />
            </div>
          </div>
        </>
      )}
      {condition?.on && condition?.on.length > 0 && (
        <>
          <Separator />
          <Label>
            Select columns from {selectedDataset?.title ?? 'the joined dataset'} to
            include in {datasetHead.title}
          </Label>
          <div className="column-selection__container">
            {joiningDataset?.columns?.map(col => (
              <div key={col._id}>
                <Label unBold htmlFor={col._id}>
                  <Checkbox
                    id={col._id}
                    checked={condition.select.includes(col._id)}
                    onChange={() => {
                      setUnsavedChanges(true);
                      setJoinState(
                        R.assocPath(
                          ['condition', 'select'],
                          condition.select.includes(col._id)
                            ? condition.select.filter(cond => cond !== col._id)
                            : [...(condition.select ?? []), col._id],
                          joinState,
                        ),
                      );
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;{col.value}
                </Label>
              </div>
            ))}
          </div>
        </>
      )}

      <Separator />
      <ConfirmationContainer>
        <ButtonTertiary onClick={() => setJoinState({})}>Cancel</ButtonTertiary>
        <ButtonPrimary
          onClick={() => {
            setUnsavedChanges(false);
            socket?.emit('layer', { layerKey: 'joins', layerData: joinState });
          }}
          disabled={
            !unsavedChanges ||
            !condition ||
            (condition.on && condition.on.length === 0)
          }
        >
          Save
        </ButtonPrimary>
      </ConfirmationContainer>
    </EditorContainer>
  );
};
export default JoinEditor;
