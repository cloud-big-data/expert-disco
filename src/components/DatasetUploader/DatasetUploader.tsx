import React, { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components/macro';

import UserContext from 'contexts/userContext';
import skyvueFetch from 'services/skyvueFetch';

import ActiveDragState from './ActiveDragState';
import UploadCompleteState from './UploadCompleteState';
import UploaderEmptyState from './UploaderEmptyState';
import UploadErrorState from './UploadErrorState';
import UploadExceedsLimits from './UploadExceedsLimits';
import UploadLoadingState from './UploadLoadingState';

const DropzoneContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  height: 100%;
  & > div {
    width: 100%;
  }
`;

export const FILE_SIZE_CAP_IN_BYTES = 5000000000;

const DatasetUploader: React.FC<{
  closeModal?: () => void;
}> = ({ closeModal }) => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [fileExceedLimits, setFileExceedsLimits] = useState(false);

  const { accessToken } = useContext(UserContext);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setLoadingState(true);
      acceptedFiles.forEach(async (file, index: number) => {
        if (file.size >= FILE_SIZE_CAP_IN_BYTES) {
          setLoadingState(false);
          setFileExceedsLimits(true);
          return;
        }
        try {
          const { url, fields, status } = await skyvueFetch(accessToken).post(
            '/datasets/make_dataset_upload_url',
            {
              title: file.name?.replace('.csv', ''),
            },
          );

          if (status >= 400) {
            setLoadingState(false);
            setError(true);
            return;
          }

          const data = {
            bucket: 'skyvue-datasets-queue',
            ...fields,
            'Content-Type': 'text/csv',
            file,
          };

          const formData = new FormData();
          Object.keys(data).forEach(name => {
            formData.append(name, data[name]);
          });

          await fetch(url, {
            method: 'POST',
            body: formData,
          });
        } catch (e) {
          console.log(e);
          setError(true);
          setLoadingState(false);
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
        ) : fileExceedLimits ? (
          <UploadExceedsLimits />
        ) : (
          <UploaderEmptyState />
        )}
      </div>
    </DropzoneContainer>
  );
};

export default DatasetUploader;
