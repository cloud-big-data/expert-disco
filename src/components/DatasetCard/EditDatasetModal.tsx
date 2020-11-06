import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonTertiary,
} from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import Modal from 'components/ui/Modal';
import { Text, DangerText, Label } from 'components/ui/Typography';

import React, { useState } from 'react';
import styled from 'styled-components/macro';

const EditModalContainer = styled.div`
  height: 100%;
  width: 100%;
  .delete_conf {
    align-items: center;
    height: 80%;
    justify-content: center;
    margin: auto;
    text-align: center;
    flex-direction: column;
  }
  .body {
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-direction: column;
    .edit-name__container {
      margin-top: auto;
    }
    .buttons__container {
      display: flex;
      flex-direction: column;
      margin-top: auto;
      justify-content: center;
      align-items: center;
      width: 100%;
      .split {
        display: flex;
        button {
          &:first-of-type {
            margin-right: 2rem;
          }
        }
      }
    }
  }
`;

const EditDatasetModal: React.FC<{
  closeModal: () => void;
  deleteConf: boolean;
  setDeleteConf: (conf: boolean) => void;
  initialTitle: string;
  updateDataset: (newTitle: string) => void;
  deleteDataset: () => void;
}> = ({
  closeModal,
  deleteConf,
  setDeleteConf,
  initialTitle,
  updateDataset,
  deleteDataset,
}) => {
  const [datasetTitle, setDatasetTitle] = useState(initialTitle);
  return (
    <Modal closeModal={closeModal}>
      <EditModalContainer onClick={e => e.preventDefault()}>
        <h4 style={{ margin: 0 }}>Editing {initialTitle}</h4>
        <div
          className="delete_conf"
          style={{ display: deleteConf ? 'flex' : 'none' }}
        >
          <Text size="lg" len="short">
            Are you sure you want to delete <strong>{datasetTitle}</strong>?
          </Text>
          <ButtonSecondary onClick={deleteDataset}>Yes, I'm sure</ButtonSecondary>
          <ButtonTertiary onClick={() => setDeleteConf(false)}>
            Cancel
          </ButtonTertiary>
        </div>
        <div className="body" style={{ display: deleteConf ? 'none' : 'flex' }}>
          <div className="edit-name__container">
            <Label>Dataset name:</Label>
            <br />
            <InputField
              value={datasetTitle}
              onChange={e => setDatasetTitle(e.target.value)}
            />
          </div>
          <div className="buttons__container">
            <div className="split">
              <ButtonSecondary onClick={closeModal}>Cancel</ButtonSecondary>
              <ButtonPrimary onClick={() => updateDataset(datasetTitle)}>
                Save
              </ButtonPrimary>
            </div>
            <div className="full">
              <ButtonTertiary
                onClick={() => setDeleteConf(true)}
                style={{ margin: 0 }}
              >
                <DangerText style={{ margin: 0 }} size="sm" len="short">
                  Delete dataset
                </DangerText>
              </ButtonTertiary>
            </div>
          </div>
        </div>
      </EditModalContainer>
    </Modal>
  );
};

export default EditDatasetModal;
