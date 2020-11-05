import DatasetCard from 'components/DatasetCard';
import DatasetUploader from 'components/DatasetUploader';
import { ButtonPrimary } from 'components/ui/Buttons';
import Modal from 'components/ui/Modal';
import UserContext from 'contexts/userContext';
import React, { useContext, useState } from 'react';
import skyvueFetch from 'services/skyvueFetch';
import styled from 'styled-components/macro';
import { useQuery } from 'react-query';
import Loading from 'components/ui/Loading';
import { Text } from 'components/ui/Typography';

const MyDatasetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  #new_dataset {
    margin-left: auto;
    i {
      color: white;
      margin-left: 0.5rem;
    }
  }
  .empty__container {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    #new_dataset {
      margin-right: auto;
    }
  }
  .top__bar {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 4fr);
  }
`;

const MyDatasets: React.FC = () => {
  const { accessToken } = useContext(UserContext);
  const [newDatasetModalIsOpen, setNewDatasetModalIsOpen] = useState(false);
  const { isLoading, data } = useQuery(newDatasetModalIsOpen, () =>
    skyvueFetch(accessToken!).get('/datasets'),
  );

  const datasets: Array<{
    title: string;
    updatedAt: string;
    _id: string;
  }> = data ?? [];

  return (
    <MyDatasetsContainer>
      <div className="top__bar">
        <h3 style={{ margin: 0 }}>My datasets</h3>
        {!isLoading && datasets.length > 0 && (
          <ButtonPrimary
            onClick={() => setNewDatasetModalIsOpen(true)}
            id="new_dataset"
          >
            New dataset <i className="fad fa-plus-circle" />
          </ButtonPrimary>
        )}
        {newDatasetModalIsOpen && (
          <Modal closeModal={() => setNewDatasetModalIsOpen(false)}>
            <DatasetUploader closeModal={() => setNewDatasetModalIsOpen(false)} />
          </Modal>
        )}
      </div>
      {!isLoading && datasets.length === 0 && (
        <div className="empty__container">
          <Text size="lg" len="short">
            Start your first dataset (need a better empty state)
          </Text>
          <ButtonPrimary
            onClick={() => setNewDatasetModalIsOpen(true)}
            id="new_dataset"
          >
            New dataset <i className="fad fa-plus-circle" />
          </ButtonPrimary>
        </div>
      )}
      <ListContainer>
        {isLoading && <Loading />}
        {datasets.map(dataset => (
          <DatasetCard
            key={dataset._id}
            datasetId={dataset._id}
            timestamp={dataset.updatedAt}
            title={dataset.title}
          />
        ))}
      </ListContainer>
    </MyDatasetsContainer>
  );
};

export default MyDatasets;
