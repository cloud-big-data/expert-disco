import { IGroupLayer, AggregateFunctions } from 'app/dataset/types';
import Select from 'components/ui/Select';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';
import getColumnNameById from 'app/dataset/lib/getColumnNameById';
import Checkbox from 'components/ui/Checkbox';
import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import { Label } from 'components/ui/Typography';

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
const GroupingContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;
  grid-column-gap: 1rem;

  > div {
    display: flex;
    flex-direction: column;

    .group-criteria__container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    }
  }

  .select__container {
    display: flex;
    align-items: center;
    span:not(.ant-checkbox) {
      margin-left: 0.25rem;
    }
    .select-search {
      margin-left: 1rem;
    }
  }

  @media (max-width: 1200px) {
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
    .filter(x => !groupedBy?.includes(x._id))
    .map(x => x._id);

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
      <GroupingContainer>
        <div>
          <Label>Group by:</Label>
          <div className="group-criteria__container">
            {boardData.columns.map(col => (
              <div key={col._id} className="select__container">
                <Checkbox
                  disabled={R.includes(col._id, R.keys(columnAggregates))}
                  checked={groupedBy.includes(col._id)}
                  onChange={() => {
                    setGroupingState({
                      ...groupingState,
                      groupedBy: groupedBy.includes(col._id)
                        ? groupedBy.filter(x => x !== col._id)
                        : [...groupedBy, col._id],
                    });
                  }}
                >
                  {col.value}
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
        <div>
          {availableColumns.length > 0 && groupedBy.length > 0 && (
            <>
              <Label>Aggregate functions</Label>
              {availableColumns.map(col => (
                <div key={col} className="select__container">
                  <Checkbox
                    checked={R.includes(col, R.keys(columnAggregates))}
                    onChange={e => {
                      setGroupingState(
                        e.target.checked
                          ? {
                              ...groupingState,
                              columnAggregates: {
                                ...groupingState.columnAggregates,
                                [col]: 'sum',
                              },
                            }
                          : {
                              ...groupingState,
                              columnAggregates: R.omit([col], columnAggregates),
                            },
                      );
                    }}
                  >
                    {getColumnNameById(col, boardData)}
                  </Checkbox>

                  {R.includes(col, R.keys(columnAggregates)) && (
                    <Select
                      onChange={e => console.log(e)}
                      options={aggregateFunctions}
                    />
                  )}
                </div>
              ))}
            </>
          )}
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
