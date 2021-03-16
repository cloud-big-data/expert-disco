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
import { Empty } from 'antd';
import Styles from 'styles/Styles';

const MyDatasetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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

    #new_dataset {
      margin-left: auto;
      i {
        color: white;
        margin-left: 0.5rem;
      }
    }

    @media (max-width: 500px) {
      flex-direction: column;
      #new_dataset {
        margin-top: 0.5rem;
        margin-right: auto;
      }
    }
  }

  #edit_toggle {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 0;
    margin-left: auto;
  }
  #edit_toggle.white {
    i {
      color: white;
    }
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
  const fetcher = skyvueFetch(accessToken!);
  const [loadingState, setLoadingState] = useState(false);
  const { isLoading, data, refetch } = useQuery(newDatasetModalIsOpen, () =>
    fetcher.get('/datasets'),
  );

  console.log(accessToken);

  const duplicateDataset = async (datasetId: string, title: string) => {
    setLoadingState(true);
    const duplicatedDataset = await fetcher.post(
      `/datasets/duplicate/${datasetId}`,
      {
        newTitle: title,
        raw: true,
      },
    );

    setLoadingState(false);

    if (duplicatedDataset._id) {
      refetch();
    }
  };

  const { error } = data ?? {};
  if (error) return <p>Error occurred!</p>;

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
          <>
            <ButtonPrimary
              onClick={() => setNewDatasetModalIsOpen(true)}
              id="new_dataset"
              iconRight={<i className="fad fa-plus-circle" />}
            >
              New dataset
            </ButtonPrimary>
          </>
        )}
        {newDatasetModalIsOpen && (
          <Modal closeModal={() => setNewDatasetModalIsOpen(false)}>
            <DatasetUploader closeModal={() => setNewDatasetModalIsOpen(false)} />
          </Modal>
        )}
      </div>
      {!isLoading && datasets.length === 0 && (
        <Empty
          description="Import a CSV file to create your first dataset!"
          image={
            <i
              style={{ color: Styles.purple300, fontSize: '90px' }}
              className="fad fa-file-spreadsheet"
            />
          }
        >
          <ButtonPrimary
            style={{ margin: '0 auto' }}
            iconLeft={
              <i style={{ color: 'white' }} className="fad fa-plus-circle" />
            }
            onClick={() => setNewDatasetModalIsOpen(true)}
            id="new_dataset"
          >
            New dataset
          </ButtonPrimary>
        </Empty>
      )}
      <ListContainer>
        {(loadingState || isLoading) && <Loading />}
        {datasets?.map(dataset => (
          <DatasetCard
            key={dataset._id}
            datasetId={dataset._id}
            timestamp={dataset.updatedAt}
            title={dataset.title}
            refetch={refetch}
            duplicateDataset={duplicateDataset}
          />
        ))}
      </ListContainer>
    </MyDatasetsContainer>
  );
};

export default MyDatasets;
