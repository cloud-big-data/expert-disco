import UserContext from 'contexts/userContext';
import React, { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import skyvueFetch from 'services/skyvueFetch';
import styled from 'styled-components/macro';
import ActiveDragState from './ActiveDragState';
import UploadCompleteState from './UploadCompleteState';
import UploaderEmptyState from './UploaderEmptyState';
import UploadErrorState from './UploadErrorState';
import UploadLoadingState from './UploadLoadingState';

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
  const [loadingState, setLoadingState] = useState(false);
  const { accessToken } = useContext(UserContext);
  const onDrop = useCallback(
    acceptedFiles => {
      setLoadingState(true);
      acceptedFiles.forEach(async (file: any, index: number) => {
        try {
          const { url, fields } = await skyvueFetch(accessToken).get(
            '/datasets/make_dataset_upload_url',
          );

          const data = {
            bucket: 'skyvue-datasets',
            ...fields,
            'Content-Type': 'text/csv',
            file,
          };

          const formData = new FormData();
          Object.keys(data).forEach(name => {
            formData.append(name, data[name]);
          });

          const response = await fetch(url, {
            method: 'POST',
            body: formData,
          });

          const json = await response.json();
          console.log(json);
          // const formData = new FormData();
          // formData.append('csv', file);
          // await skyvueFetch(accessToken!).postFile('/datasets/upload', formData);
        } catch (e) {
          console.error(e);
          setError(true);
          return;
        }

        if (index === acceptedFiles.length - 1) {
          setUploadComplete(true);
          setLoadingState(false);
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
        {loadingState ? (
          <UploadLoadingState />
        ) : error ? (
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
