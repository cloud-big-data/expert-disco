import React, { useCallback, useContext, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import styled from 'styled-components/macro';

import DatasetContext from 'contexts/DatasetContext';
import skyvueFetch from 'services/skyvueFetch';
import UserContext from 'contexts/userContext';
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

const DatasetAppendUploader: React.FC<{
  closeModal?: () => void;
}> = ({ closeModal }) => {
  const { accessToken } = useContext(UserContext);
  const { socket, datasetHead } = useContext(DatasetContext)!;
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(false);
  const [tooManyFiles, setTooManyFiles] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [fileExceedLimits, setFileExceedsLimits] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (
        fileRejections.some(reject => reject.errors[0].code === 'too-many-files')
      ) {
        setTooManyFiles(true);
        setError(true);
        return;
      }
      if (acceptedFiles.length > 1) {
        setLoadingState(false);
        setError(true);
        return alert('You can only upload one file at a time when appending data.');
      }
      setLoadingState(true);
      acceptedFiles.forEach(async (file, index: number) => {
        if (file.size >= FILE_SIZE_CAP_IN_BYTES) {
          setLoadingState(false);
          setFileExceedsLimits(true);
          return;
        }
        try {
          const { url, fields, status } = await skyvueFetch(accessToken).post(
            `/datasets/make_dataset_append_url/${datasetHead._id}`,
            {},
          );

          if (status >= 400) {
            setLoadingState(false);
            setError(true);
            return;
          }

          const data = {
            bucket: 'skyvue-datasets-appends',
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
          socket?.emit('appendUploadComplete', datasetHead._id);
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
    [accessToken, datasetHead._id, socket],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  return (
    <DropzoneContainer>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {loadingState ? (
          <UploadLoadingState />
        ) : error ? (
          <UploadErrorState
            text={tooManyFiles ? 'Please only upload one file at a time' : undefined}
            returnToUpload={() => setError(false)}
          />
        ) : uploadComplete ? (
          <UploadCompleteState closeModal={closeModal} />
        ) : isDragActive ? (
          <ActiveDragState />
        ) : fileExceedLimits ? (
          <UploadExceedsLimits />
        ) : (
          <UploaderEmptyState plural={false} />
        )}
      </div>
    </DropzoneContainer>
  );
};

export default DatasetAppendUploader;
