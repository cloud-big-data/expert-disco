import DropdownMenu from 'components/DropdownMenu';
import UserContext from 'contexts/userContext';
import React, { useContext, useState } from 'react';
import { RefetchOptions } from 'react-query/types/core/query';
import skyvueFetch from 'services/skyvueFetch';
import DatasetCardBody from './DatasetCardBody';
import EditDatasetModal from './EditDatasetModal';

const DatasetCard: React.FC<{
  datasetId: string;
  title: string;
  timestamp: string;
  description?: string;
  refetch: (options?: RefetchOptions | undefined) => Promise<any>;
}> = ({ datasetId, title, description, timestamp, refetch }) => {
  const { accessToken } = useContext(UserContext);
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteConf, setDeleteConf] = useState(false);
  const closeModal = () => {
    setDeleteConf(false);
    setEditModalIsOpen(false);
  };

  const fetcher = skyvueFetch(accessToken!);
  const updateDataset = async (newTitle: string) => {
    await fetcher.patch(`/datasets/${datasetId}`, { title: newTitle });
    refetch();
    setEditModalIsOpen(false);
  };

  const deleteDataset = async () => {
    await fetcher.delete(`/datasets/${datasetId}`, {});
    refetch();
    setEditModalIsOpen(false);
  };

  const OPTIONS = [
    {
      label: 'Open in new tab',
      onClick: () => undefined,
      icon: <i className="fad fa-external-link" />,
    },
  ];

  return (
    <>
      <DatasetCardBody
        datasetId={datasetId}
        title={title}
        timestamp={timestamp}
        description={description}
        setEditModalIsOpen={setEditModalIsOpen}
        setContextMenuIsOpen={() => setContextMenuIsOpen(!contextMenuIsOpen)}
      />

      {editModalIsOpen && (
        <EditDatasetModal
          deleteConf={deleteConf}
          setDeleteConf={setDeleteConf}
          closeModal={closeModal}
          initialTitle={title}
          updateDataset={updateDataset}
          deleteDataset={deleteDataset}
        />
      )}

      {contextMenuIsOpen && (
        <DropdownMenu
          options={OPTIONS}
          closeMenu={() => setContextMenuIsOpen(false)}
        />
      )}
    </>
  );
};

export default DatasetCard;
