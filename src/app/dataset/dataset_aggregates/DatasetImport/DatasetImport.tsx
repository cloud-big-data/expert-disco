import React, { FC, useState } from 'react';

import { Switch, Table } from 'antd';

import DatasetUploaderToSocket from 'components/DatasetUploader/DatasetUploaderToSocket';
import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import Modal from 'components/ui/Modal';

import useDatasetContext from 'hooks/useDatasetContext';
import { Label } from 'components/ui/Typography';

const DatasetImport: FC = () => {
  const { uploadPreview, setUploadPreview } = useDatasetContext()!;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [view, setView] = useState<'current' | 'history'>('current');
  const [isColumnHeader, setIsColumnHeader] = useState(true);
  const [shouldDedupe, setShouldDedupe] = useState(false);

  const previewColumns = Object.keys(uploadPreview[0] ?? {}).map(key => ({
    title: key,
    dataIndex: key,
    key,
  }));

  return (
    <div>
      {modalIsOpen && (
        <Modal closeModal={() => setModalIsOpen(false)}>
          <DatasetUploaderToSocket closeModal={() => setModalIsOpen(false)} />
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <h6>Import more data</h6>
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
        (uploadPreview.length > 0 ? (
          <div>
            <Label>View of current first and last rows</Label>
            <Table
              pagination={{ hideOnSinglePage: true }}
              columns={previewColumns}
              dataSource={uploadPreview}
            />
            <div className="flex items-center space-x-4 my-2 mt-8">
              <Switch
                checked={isColumnHeader}
                onChange={() => setIsColumnHeader(!isColumnHeader)}
              />
              <Label unBold>The first row of my data file is a column header</Label>
            </div>
            <div className="flex items-center space-x-4 my-2">
              <Switch
                checked={shouldDedupe}
                onChange={() => setShouldDedupe(!shouldDedupe)}
              />
              <Label unBold>I'm not worried about duplicate records</Label>
            </div>
          </div>
        ) : (
          <ButtonTertiary
            style={{ paddingLeft: '1rem', margin: '4rem auto' }}
            onClick={() => setModalIsOpen(true)}
            iconLeft={<i className="fal fa-folder-upload" />}
          >
            Upload CSV File
          </ButtonTertiary>
        ))}
      {view === 'history' && (
        <div className="flex flex-col">
          <h6>History of imports</h6>
          <div className="w-4/5 my-8 mx-auto grid grid-cols-12 gap-x-4 text-center">
            <div className="col-span-6">Original dataset</div>
            <div className="col-span-6">23000</div>
          </div>
        </div>
      )}

      {uploadPreview.length > 0 && (
        <div className="flex items-center justify-center">
          <ButtonTertiary onClick={() => setUploadPreview([])}>
            Cancel
          </ButtonTertiary>
          <ButtonPrimary disabled={uploadPreview.length === 0}>
            Continue
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
};

export default DatasetImport;
