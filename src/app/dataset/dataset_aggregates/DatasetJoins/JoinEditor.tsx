import { IJoinLayer, IServerDataset, JoinTypes } from 'app/dataset/types';
import ConfirmationContainer from 'components/ConfirmationButtons';
import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import Select from 'components/ui/Select';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import skyvueFetch from 'services/skyvueFetch';

import * as R from 'ramda';

import styled from 'styled-components/macro';
import { DangerText, Label, Text } from 'components/ui/Typography';
import Separator from 'components/Separator';
import { Checkbox, Tabs } from 'antd';
import updateLayers from 'app/dataset/lib/updateLayers';
import keyLength from 'utils/keyLength';

const { TabPane } = Tabs;

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

const ERROR_TEXT = `In order to join a dataset, the joining dataset must not have any
preexisting joins. If you would like to join a dataset that is already
joined on another dataset, duplicate that dataset to create a saved,
compiled version, then join that new version.`;

const JOIN_VIEW_COPY = {
  errors: {
    nestedJoin: ERROR_TEXT,
  },
  joinTypes: {
    left: (
      <Text className="max-w-2xl" size="sm" len="short">
        Joins to a new dataset, and then enhances your records by{' '}
        <span className="underline">matching and adding new fields</span> to your
        dataset. Use this when you want to add more information to your existing
        list. (i.e. making your dataset WIDER).
      </Text>
    ),
    inner: (
      <Text className="max-w-2xl" size="sm" len="short">
        Joins to a new dataset, and then filters & returns ONLY records that appear
        in both datasets. Think of this as filtering your dataset based on another
        list.
      </Text>
    ),
  },
};

const JoinEditor: FC<{
  unsavedChanges: boolean;
  setUnsavedChanges: (changes: boolean) => void;
  joinState: Partial<IJoinLayer>;
  setJoinState: (state: Partial<IJoinLayer>) => void;
}> = ({ unsavedChanges, setUnsavedChanges, joinState, setJoinState }) => {
  const [newJoinState, setNewJoinState] = useState(joinState);

  const { condition } = newJoinState;
  const { datasetHead, boardData, socket, queriedDatasets, setLoading } = useContext(
    DatasetContext,
  )!;
  const { accessToken } = useContext(UserContext)!;
  const { error, isLoading, ...availableDatasets } = useQuery<IServerDataset[]>(
    newJoinState.condition?.datasetId,
    () => skyvueFetch(accessToken).get(`/datasets`),
  );

  const selectedDataset = availableDatasets.data?.find(
    dataset => dataset._id === condition?.datasetId,
  );

  const joiningDataset = queriedDatasets.find(
    dataset => dataset._id === condition?.datasetId,
  );

  const isNestedJoin = keyLength(joiningDataset?.layers.joins) > 0;

  const joinableColumns = joiningDataset?.columns.filter(
    col => !col.isSmartColumn && (col.isUnique === true || col._id),
  );

  const updateJoinOn = (colId: string, key: string) => {
    setUnsavedChanges(true);
    setNewJoinState(
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
        newJoinState,
      ),
    );
  };

  useEffect(() => {
    if (condition && condition.datasetId && !joiningDataset) {
      socket?.emit('queryBoardHeaders', condition.datasetId);
    }
  }, [condition, joiningDataset, socket]);

  const makeJoinOptions = () =>
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
        ];

  return (
    <EditorContainer>
      {isNestedJoin && (
        <DangerText size="lg" len="short">
          {ERROR_TEXT}
        </DangerText>
      )}
      <Tabs
        defaultActiveKey={joinState.joinType ?? 'left'}
        onChange={e => {
          setNewJoinState({ ...newJoinState, joinType: e as JoinTypes });
          setUnsavedChanges(true);
        }}
      >
        <TabPane tab="Enhance records (Left join)" key="left">
          {JOIN_VIEW_COPY.joinTypes.left}
        </TabPane>
        <TabPane tab="Keep only matches (inner join)" key="inner">
          {JOIN_VIEW_COPY.joinTypes.inner}
        </TabPane>
      </Tabs>

      <Separator />

      <Label>Select a dataset to join</Label>
      <Select
        value={condition?.datasetId}
        placeholder="Select a dataset to join"
        onChange={e => {
          if (e === 'none') {
            setNewJoinState({});
            updateLayers({ layerKey: 'joins', layerData: {} }, socket, () =>
              setLoading(true),
            );
            return;
          }
          socket?.emit('queryBoardHeaders', e);
          setNewJoinState(R.assocPath(['condition', 'datasetId'], e, newJoinState));
          setUnsavedChanges(true);
        }}
        options={makeJoinOptions()}
      />
      {selectedDataset && !isNestedJoin && (
        <>
          <Separator />
          <div className="conditions__container">
            <div>
              <Label>Join where this column from {datasetHead.title}</Label>
              <Select
                value={condition?.on?.[0]?.mainColumnId}
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
                value={condition?.on?.[0]?.joinedColumnId}
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
      {!isNestedJoin && condition?.on && condition?.on.length > 0 && (
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
                      setNewJoinState(
                        R.assocPath(
                          ['condition', 'select'],
                          condition.select.includes(col._id)
                            ? condition.select.filter(cond => cond !== col._id)
                            : [...(condition.select ?? []), col._id],
                          newJoinState,
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
        <ButtonTertiary
          onClick={() => {
            setNewJoinState(joinState);
          }}
        >
          Cancel
        </ButtonTertiary>
        <ButtonPrimary
          onClick={() => {
            setUnsavedChanges(false);
            setJoinState(newJoinState);
            updateLayers(
              { layerKey: 'joins', layerData: newJoinState },
              socket,
              () => setLoading(true),
            );
          }}
          disabled={
            isNestedJoin ||
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
