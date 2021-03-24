import React, { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components/macro';

import DatasetContext from 'contexts/DatasetContext';
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

const DatasetUploaderToSocket: React.FC<{
  closeModal?: () => void;
}> = ({ closeModal }) => {
  const { socket } = useContext(DatasetContext)!;
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [fileExceedLimits, setFileExceedsLimits] = useState(false);

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
          socket?.emit('datadump', file);
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
    [socket],
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

export default DatasetUploaderToSocket;
