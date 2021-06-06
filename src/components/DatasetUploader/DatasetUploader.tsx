import React, { useCallback, useContext, useRef, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
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
  const [tooManyFiles, setTooManyFiles] = useState(false);
  const completeUploadRef = useRef<undefined | (() => Promise<void>)>();

  const { accessToken } = useContext(UserContext);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (
        fileRejections.some(reject => reject.errors[0].code === 'too-many-files')
      ) {
        setTooManyFiles(true);
        setError(true);
        return;
      }
      setLoadingState(true);
      acceptedFiles.forEach(async (file, index: number) => {
        if (file.size >= FILE_SIZE_CAP_IN_BYTES) {
          setLoadingState(false);
          setFileExceedsLimits(true);
          return;
        }
        try {
          const { _id, ...previewData } = await skyvueFetch(accessToken).post(
            '/datasets/make_dataset_preview_url',
            {
              title: file.name?.replace('.csv', ''),
            },
          );

          const previewDataOptions = {
            bucket: 'skyvue-upload-previews',
            ...previewData.fields,
            'Content-Type': file.type,
            file: previewData.file,
          };

          const previewForm = new FormData();
          Object.keys(previewDataOptions).forEach(name => {
            previewForm.append(name, previewDataOptions[name]);
          });

          await fetch(previewData.url, {
            method: 'POST',
            body: previewForm,
          });

          // todo get preview data right here

          completeUploadRef.current = async () => {
            console.log('why have I been called');
            const { url, fields, status } = await skyvueFetch(accessToken).post(
              '/datasets/make_dataset_upload_url',
              {
                title: file.name?.replace('.csv', ''),
              },
            );
            const data = {
              bucket: 'skyvue-datasets-queue',
              ...fields,
              'Content-Type': file.type,
              file,
            };

            if (status >= 400) {
              setLoadingState(false);
              setError(true);
              return;
            }

            const formData = new FormData();
            Object.keys(data).forEach(name => {
              formData.append(name, data[name]);
            });

            await fetch(url, {
              method: 'POST',
              body: formData,
            });
          };

          // todo set uploadState(true)
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
            text={tooManyFiles ? 'Please only upload 1 file at a time' : undefined}
            returnToUpload={() => setError(false)}
          />
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
