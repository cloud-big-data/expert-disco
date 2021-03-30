import DatasetUploaderToSocket from 'components/DatasetUploader/DatasetUploaderToSocket';
import React, { FC } from 'react';

const FileUpload: FC<{ closeModal: () => void }> = ({ closeModal }) => (
  <DatasetUploaderToSocket closeModal={closeModal} />
);

export default FileUpload;
