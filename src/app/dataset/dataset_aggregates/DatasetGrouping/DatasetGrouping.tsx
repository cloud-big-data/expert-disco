import { IGroupLayer, AggregateFunctions } from 'app/dataset/types';
import Select from 'components/ui/Select';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';
import { ButtonPrimary, ButtonTertiary, IconButton } from 'components/ui/Buttons';
import { Helper, Label, Text } from 'components/ui/Typography';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import Styles from 'styles/Styles';
import { Empty } from 'antd';
import { OperatorBreak } from '../Styles';

const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const GroupLayerContainer = styled.div`
  display: flex;
  flex-direction: column;

  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .top {
    display: flex;
    width: 100%;
    .left {
      margin-left: 0;
    }
    .right {
      margin-left: auto;
    }
  }
`;
const GroupingContainer = styled.div<{ length: number }>`
  display: grid;
  grid-template-columns: ${props => (props.length === 0 ? 'auto' : `1fr 3fr`)};
  column-gap: 4rem;

  .group-criteria__container {
    display: grid;
    grid-row-gap: 0.5rem;
  }

  .grouped-by__container {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    i {
      margin-left: 0.5rem;
    }
  }

  .aggregate__container {
    display: 'flex';
    flex-direction: column;
  }

  .agg-item__container {
    margin-top: 0.5rem;
    display: grid;
    grid-template-columns: repeat(3, auto);
    column-gap: 0.5rem;
    align-items: center;

    .first {
      display: flex;
      align-items: center;
    }
  }

  .select__container {
    display: flex;
    align-items: center;
    span:not(.ant-checkbox-inner, .ant-checkbox) {
      margin-left: 0.25rem;
    }
    .select-search {
      margin-left: 1rem;
    }
  }

  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column;
  }
`;

const aggregateFunctions: Array<{
  name: string;
  value: AggregateFunctions;
}> = [
  { name: 'sum', value: 'sum' },
  { name: 'mean', value: 'mean' },
  { name: 'median', value: 'median' },
  { name: 'count distinct', value: 'countDistinct' },
  { name: 'count', value: 'count' },
  { name: 'maximum value', value: 'max' },
  { name: 'minimum value', value: 'min' },
  { name: 'standard deviation', value: 'stdev' },
];

const DatasetGrouping: React.FC = () => {
  const { datasetHead, boardData, socket } = useContext(DatasetContext)!;
  const [groupingState, _setGroupingState] = useState<IGroupLayer>(
    boardData.layers?.groupings.columnAggregates
      ? boardData.layers?.groupings
      : {
          groupedBy: [],
          columnAggregates: {},
        },
  );
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const setGroupingState = (state: IGroupLayer) => {
    _setGroupingState(() => {
      setUnsavedChanges(true);
      return state;
    });
  };
  const { groupedBy, columnAggregates } = groupingState;
  const availableColumns = boardData.columns
    .filter(
      x => !groupedBy?.includes(x._id) && !R.keys(columnAggregates).includes(x._id),
    )
    .map(x => x._id);

  const onDragEnd = (result: DropResult) => {
    //    dropped outside the list
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    setGroupingState({
      ...groupingState,
      groupedBy: reorder(groupedBy, source.index, destination.index),
    });
  };

  return (
    <GroupLayerContainer>
      <div className="top">
        <h6 className="left">Group {datasetHead.title}</h6>
        <div className="right">
          <ButtonTertiary
            onClick={() => socket?.emit('clearLayers')}
            style={{ margin: 0, padding: 0 }}
          >
            Clear all filters
          </ButtonTertiary>
        </div>
      </div>
      <GroupingContainer length={groupedBy.length}>
        <div className="group-criteria__container">
          {groupedBy.length > 0 && <Label>Group by:</Label>}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {groupedBy.map((colId, index) => (
                    <Draggable key={colId} draggableId={colId} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginLeft: snapshot.isDragging ? 0 : `${index * 2}rem`,
                          }}
                          key={colId}
                          className="grouped-by__container"
                        >
                          <IconButton
                            onClick={() =>
                              setGroupingState({
                                ...groupingState,
                                groupedBy: groupedBy.filter(x => x !== colId),
                              })
                            }
                          >
                            <i
                              style={{ color: Styles.red400 }}
                              className="far fa-times-circle"
                            />
                          </IconButton>
                          <Select
                            options={boardData.columns.map(col => ({
                              name: col.value ?? '',
                              value: col._id ?? '',
                              disabled: !availableColumns.find(
                                col_ => col._id === col_,
                              ),
                            }))}
                            value={colId}
                            onChange={e =>
                              setGroupingState({
                                ...groupingState,
                                groupedBy: groupedBy.map((col, index_) =>
                                  index === index_ ? (e as string) : col,
                                ),
                              })
                            }
                          />
                          {groupedBy.length > 1 && (
                            <i className="fad fa-grip-lines" />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {groupedBy.length === 0 ? (
            <Empty
              description={
                <Text size="lg" len="short">
                  Group your dataset copy blah blah
                </Text>
              }
              style={{ textAlign: 'center' }}
            >
              <ButtonPrimary
                onClick={() =>
                  setGroupingState({
                    ...groupingState,
                    groupedBy: [...groupedBy, availableColumns[0]],
                  })
                }
                style={{
                  margin: '0 auto',
                  display: unsavedChanges ? 'none' : 'flex',
                }}
              >
                Start
              </ButtonPrimary>
            </Empty>
          ) : (
            <OperatorBreak
              onClick={() =>
                setGroupingState({
                  ...groupingState,
                  groupedBy: [...groupedBy, availableColumns[0]],
                })
              }
            >
              + add column
            </OperatorBreak>
          )}
        </div>
        <div
          style={{ display: groupedBy.length === 0 ? 'none' : 'flex' }}
          className="aggregate__container"
        >
          <Label>Values to be summarized + summary type</Label>
          {R.keys(columnAggregates).map(key => (
            <div key={key} className="agg-item__container">
              <div className="first">
                <IconButton
                  style={{ marginRight: '.5rem' }}
                  onClick={() =>
                    setGroupingState({
                      ...groupingState,
                      columnAggregates: R.omit([key as string], columnAggregates),
                    })
                  }
                >
                  <i
                    style={{ color: Styles.red400 }}
                    className="far fa-times-circle"
                  />
                </IconButton>
                <Select
                  placeholder="column"
                  value={key as string}
                  options={boardData.columns.map(col => ({
                    name: col.value ?? '',
                    value: col._id ?? '',
                    disabled: !availableColumns.find(col_ => col_ === col._id),
                  }))}
                  onChange={e => {
                    const removed = R.omit([key as string])(columnAggregates);
                    setGroupingState({
                      ...groupingState,
                      columnAggregates: {
                        ...removed,
                        [e]: columnAggregates[e] ?? 'sum',
                      },
                    });
                  }}
                />
              </div>
              {columnAggregates[key] && (
                <>
                  <Helper style={{ marginBottom: 0 }}>Summarized by</Helper>
                  <Select
                    value={columnAggregates[key]}
                    placeholder="column"
                    options={aggregateFunctions}
                    onChange={e =>
                      setGroupingState(
                        R.assocPath(
                          ['columnAggregates', key as string],
                          e,
                          groupingState,
                        ),
                      )
                    }
                  />
                </>
              )}
            </div>
          ))}

          <OperatorBreak
            onClick={() =>
              setGroupingState({
                ...groupingState,
                columnAggregates: R.assoc(
                  availableColumns[0],
                  'sum',
                  columnAggregates,
                ),
              })
            }
          >
            + add column
          </OperatorBreak>
        </div>
      </GroupingContainer>
      {unsavedChanges && (
        <div className="actions">
          <ButtonPrimary
            onClick={() => {
              setUnsavedChanges(false);
              socket?.emit('layer', {
                layerKey: 'groupings',
                layerData: groupingState,
              });
            }}
          >
            Save changes
          </ButtonPrimary>
        </div>
      )}
    </GroupLayerContainer>
  );
};

export default DatasetGrouping;
