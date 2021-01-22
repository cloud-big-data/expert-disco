/* eslint-disable no-self-compare */
import React, { createContext, useContext, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { IFilterLayer } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import * as R from 'ramda';
import { Label } from 'components/ui/Typography';
import { Switch } from 'antd';
import FilterRow from './FilterRow';

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .top {
    width: 100%;
    display: flex;
    z-index: 1;
    button {
      margin-left: auto;
      padding: 0;
      margin-bottom: 1.375rem;
    }

    .right {
      margin-left: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
  .options__container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .actions__container {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 2rem;
  }
`;

export const FilterContext = createContext<{
  parentFilterState?: IFilterLayer;
}>({ parentFilterState: undefined });

const DatasetFilters: React.FC = () => {
  const { boardData, setBoardData, socket } = useContext(DatasetContext)!;
  const initialFiltersState = useRef<IFilterLayer>(boardData.layers?.filters ?? []);
  const [filtersState, setFiltersState] = useState<IFilterLayer>(
    boardData.layers?.filters ?? [],
  );
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const sort = R.sortBy(x => Array.isArray(x));
  const sortFilterLayer = (layer: any) => {
    if (!layer.find((x: any) => Array.isArray(x))) return layer;
    return sort(
      layer.map((x: any) => (Array.isArray(x) ? sortFilterLayer(sort(x)) : x)),
    );
  };

  const sortedFiltersState = sortFilterLayer(filtersState);

  return (
    <FiltersContainer>
      <div className="top">
        <h6>Filter this dataset</h6>
        <div className="right">
          <Label>Apply layer</Label>
          <Switch
            onChange={e => {
              setBoardData?.({
                ...boardData,
                layerToggles: {
                  ...boardData.layerToggles,
                  filters: e,
                },
              });
              socket?.emit('toggleLayer', {
                toggle: 'filters',
                visible: e,
              });
            }}
            checked={boardData.layerToggles.filters}
          />
        </div>
      </div>
      <div className="options__container">
        <FilterContext.Provider
          value={{
            parentFilterState: sortedFiltersState,
          }}
        >
          <FilterRow
            parent
            setFiltersState={filterState => {
              setUnsavedChanges(true);
              setFiltersState(filterState);
            }}
            filtersState={sortedFiltersState}
          />
        </FilterContext.Provider>
      </div>

      {unsavedChanges && (
        <div className="actions__container">
          <ButtonTertiary
            onClick={() => {
              setUnsavedChanges(false);
              setFiltersState(initialFiltersState.current);
            }}
          >
            Cancel
          </ButtonTertiary>
          <ButtonPrimary
            onClick={() => {
              setUnsavedChanges(false);
              socket?.emit('layer', {
                layerKey: 'filters',
                layerData: sortedFiltersState,
              });
              initialFiltersState.current = sortedFiltersState;
            }}
          >
            Update
          </ButtonPrimary>
        </div>
      )}
    </FiltersContainer>
  );
};

export default DatasetFilters;
