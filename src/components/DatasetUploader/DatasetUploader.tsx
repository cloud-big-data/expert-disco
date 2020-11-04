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
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          skyvueFetch(accessToken!).post('/datasets/upload', {
            name: file.name,
            file: e.target?.result,
          });
        };

        // reader.readAsBinaryString(e[0]);
        // reader.onabort = () => console.log('file reading was aborted');
        // reader.onerror = () => console.log('file reading has failed');
        // reader.onload = () => {
        //   reader.readAsText(file);
        //   console.log(reader);

        // };
        // reader.readAsArrayBuffer(file);

        // reader.onloadend = function (e) {
        //   console.log('hi');
        // };
        // reader.readAsDataURL(selectedFile);
      });
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
