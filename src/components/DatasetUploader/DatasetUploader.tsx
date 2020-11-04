import UserContext from 'contexts/userContext';
import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import skyvueFetch from 'services/skyvueFetch';
import styled from 'styled-components/macro';

const DropzoneContainer = styled.div`
  display: flex;
  border: 1px dashed red;
  flex: 1 0 auto;
  height: 100%;
  & > div {
    width: 100%;
  }
`;

const DatasetUploader: React.FC = () => {
  const { accessToken } = useContext(UserContext);
  const onDrop = useCallback(
    acceptedFiles => {
      const formData = new FormData();
      formData.append('csv', acceptedFiles[0]);
      skyvueFetch(accessToken!).postFile('/datasets/upload', formData);
    },
    [accessToken],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <DropzoneContainer>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </DropzoneContainer>
  );
};

export default DatasetUploader;
