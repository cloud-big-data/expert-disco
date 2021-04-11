import React, { FC, useState } from 'react';

import DatasetUploaderToSocket from 'components/DatasetUploader/DatasetUploaderToSocket';
import { ButtonTertiary } from 'components/ui/Buttons';
import Modal from 'components/ui/Modal';

import useDatasetContext from 'hooks/useDatasetContext';
import { Helper } from 'components/ui/Typography';
import IconWithBg from 'components/ui/IconWithBg';
import CurrentImport from './CurrentImport';
import ImportHistory from './ImportHistory';

export interface PreviewColumn {
  title: string;
  dataIndex: string;
  key: string;
}

const DatasetImport: FC = () => {
  const { uploadPreview } = useDatasetContext()!;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [view, setView] = useState<'current' | 'history'>('current');

  const records = (uploadPreview?.records ?? []).map((record, index) => ({
    row: index === 0 ? 1 : uploadPreview?.meta.length,
    ...record,
  }));

  const previewColumns = Object.keys(records?.[0] ?? {}).map(key => ({
    title: key === 'row' ? 'row # (will not be included)' : key,
    dataIndex: key,
    key: key === 'row' ? 'skyvue-row-preview' : key,
  }));

  return (
    <div>
      {modalIsOpen && (
        <Modal closeModal={() => setModalIsOpen(false)}>
          <DatasetUploaderToSocket closeModal={() => setModalIsOpen(false)} />
        </Modal>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            <IconWithBg>
              <i className="fad fa-file-import" />
            </IconWithBg>
            <h6 style={{ margin: '0 0 0 .5rem' }}>Importing more records</h6>
          </div>
          <Helper>Use this when you want to make your list longer.</Helper>
        </div>
        <div className="flex items-center">
          <ButtonTertiary
            onClick={() => setView('current')}
            style={{
              fontSize: '.85rem',
              textDecoration: view === 'current' ? 'underline' : 'none',
            }}
          >
            Current upload
          </ButtonTertiary>
          <ButtonTertiary
            onClick={() => setView('history')}
            style={{
              fontSize: '.85rem',
              textDecoration: view === 'history' ? 'underline' : 'none',
            }}
          >
            Upload history
          </ButtonTertiary>
        </div>
      </div>
      {view === 'current' &&
        (uploadPreview && records && records.length > 0 ? (
          <CurrentImport
            previewColumns={previewColumns}
            uploadPreview={{
              ...uploadPreview,
              records,
            }}
          />
        ) : (
          <ButtonTertiary
            style={{ paddingLeft: '1rem', margin: '4rem auto' }}
            onClick={() => setModalIsOpen(true)}
            iconLeft={<i className="fal fa-folder-upload" />}
          >
            Upload CSV File
          </ButtonTertiary>
        ))}
      {view === 'history' && <ImportHistory />}
    </div>
  );
};

export default DatasetImport;
