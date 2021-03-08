import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import DatasetContext from 'contexts/DatasetContext';
import UserContext from 'contexts/userContext';
import React, { FC, FormEvent, useContext, useState } from 'react';
import skyvueFetch from 'services/skyvueFetch';
import styled from 'styled-components/macro';
import { IBoardHead } from '../types';

const DatasetMetaEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  form {
    margin-top: -5rem;
    @media (max-height: 400px) {
      margin-top: unset;
    }
  }
`;

const DatasetMetaEditor: FC<{
  datasetHead: IBoardHead;
}> = ({ datasetHead }) => {
  const [newTitle, setNewTitle] = useState(datasetHead.title);
  const { accessToken } = useContext(UserContext);
  const { refetch } = useContext(DatasetContext)!;

  const handleTitleChange = async () => {
    await skyvueFetch(accessToken).patch(`/datasets/${datasetHead._id}`, {
      title: newTitle,
    });
    refetch();
  };
  const onTitleChange = async (e: FormEvent) => {
    if (newTitle === '') return;
    e.preventDefault();
    await handleTitleChange();
  };

  return (
    <DatasetMetaEditorContainer>
      <form onSubmit={onTitleChange}>
        <InputField
          label="Dataset title"
          id="dataset-title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <ButtonPrimary
          onClick={() => handleTitleChange()}
          disabled={newTitle === datasetHead.title}
        >
          Save changes
        </ButtonPrimary>
      </form>
    </DatasetMetaEditorContainer>
  );
};

export default DatasetMetaEditor;
