import UserContext from 'contexts/userContext';
import React, { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import skyvueFetch from 'services/skyvueFetch';
import styled from 'styled-components/macro';
import ActiveDragState from './ActiveDragState';
import UploadCompleteState from './UploadCompleteState';
import UploaderEmptyState from './UploaderEmptyState';
import UploadErrorState from './UploadErrorState';

const DropzoneContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  height: 100%;
  & > div {
    width: 100%;
  }
`;

const DatasetUploader: React.FC<{
  closeModal?: () => void;
}> = ({ closeModal }) => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(false);
  const { accessToken } = useContext(UserContext);
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach(async (file: any) => {
        try {
          const formData = new FormData();
          formData.append('csv', file);
          await skyvueFetch(accessToken!).postFile('/datasets/upload', formData);
          setUploadComplete(true);
        } catch (e) {
          console.error(e);
          setError(true);
        }
      });
    },
    [accessToken],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <DropzoneContainer>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {error ? (
          <UploadErrorState returnToUpload={() => setError(false)} />
        ) : uploadComplete ? (
          <UploadCompleteState closeModal={closeModal} />
        ) : isDragActive ? (
          <ActiveDragState />
        ) : (
          <UploaderEmptyState />
        )}
      </div>
    </DropzoneContainer>
  );
};

export default DatasetUploader;
