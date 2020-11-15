import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { IFilterLayer } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import FilterSelector from './FilterSelector';

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .options__container {
    width: 100%;
  }
`;

const DatasetFilters: React.FC = () => {
  const { socket } = useContext(DatasetContext)!;
  const onAddFilter = (filter: IFilterLayer) => {
    socket?.emit('layer', {
      layerKey: 'filters',
      ...filter,
    });
  };

  return (
    <FiltersContainer>
      <h6>Where</h6>
      <div className="options__container">
        <FilterSelector onAddFilter={onAddFilter} />
      </div>
    </FiltersContainer>
  );
};

export default DatasetFilters;
