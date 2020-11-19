import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { IFilterLayer } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import { ButtonTertiary } from 'components/ui/Buttons';
import { v4 as uuidv4 } from 'uuid';
import FilterRow from './FilterRow';

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .top {
    width: 100%;
    display: flex;
    button {
      margin-left: auto;
      padding: 0;
    }
  }
  .options__container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const sampleState: IFilterLayer = [
  'AND',
  {
    filterId: uuidv4(),
    key: '2d9dc775-d7f2-4acc-ba07-6f20493abac8',
    value: '1',
    predicateType: 'equals',
  },
  [
    'OR',
    {
      filterId: uuidv4(),
      key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8c06',
      value: 'marvel/0001/002.jpg',
      predicateType: 'equals',
    },
    {
      filterId: uuidv4(),
      key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8casdf06',
      value: 'marvel/0001/003.jpg',
      predicateType: 'equals',
    },
    [
      'AND',
      {
        filterId: uuidv4(),
        key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8c06',
        value: 'marvel/0001/002.jpg',
        predicateType: 'equals',
      },
      {
        filterId: uuidv4(),
        key: 'fc8d530e-41d2-43f0-87ce-9e30ab6f8casdf06',
        value: 'marvel/0001/003.jpg',
        predicateType: 'equals',
      },
    ],
  ],
];

const DatasetFilters: React.FC = () => {
  const [filtersState, setFiltersState] = useState<IFilterLayer>(sampleState);
  const { datasetHead } = useContext(DatasetContext)!;
  // const onAddFilter = (filter: IFilterLayer) => {
  //   socket?.emit('layer', {
  //     layerKey: 'filters',
  //     ...filter,
  //   });
  // };

  return (
    <FiltersContainer>
      <div className="top">
        <h6>Filter {datasetHead.title}</h6>
        <ButtonTertiary>Clear all filters</ButtonTertiary>
      </div>
      <div className="options__container">
        <FilterRow setFiltersState={setFiltersState} filtersState={filtersState} />
      </div>
    </FiltersContainer>
  );
};

export default DatasetFilters;
