import React, { FC, useState } from 'react';

import { Switch, Table } from 'antd';

import { Label } from 'components/ui/Typography';
import { ColumnMapping, UploadPreview } from 'app/dataset/types';

import { ButtonPrimary, ButtonTertiary } from 'components/ui/Buttons';
import useDatasetContext from 'hooks/useDatasetContext';
import DedupeController from './DedupeController';
import { PreviewColumn } from './DatasetImport';
import ImportColumnMapping from './ImportColumnMapping';

/* todo add handling for when first row is not column header */
/* <div className="flex items-center space-x-4 my-2 mt-8">
    <Switch
      checked={isColumnHeader}
      onChange={() => setIsColumnHeader(!isColumnHeader)}
    />
    <Label unBold>The first row of my data file is a column header</Label>
  </div> */

const CurrentImport: FC<{
  previewColumns: PreviewColumn[];
  uploadPreview: UploadPreview;
}> = ({ previewColumns, uploadPreview }) => {
  const { boardData, setUploadPreview, setLoading, socket } = useDatasetContext()!;
  // const [isColumnHeader, setIsColumnHeader] = useState(true);
  const [view, setView] = useState<'preview' | 'mapping'>('preview');
  const [shouldDedupe, setShouldDedupe] = useState(false);
  const [dedupeSettings, setDedupeSettings] = useState<{
    dedupeOn: string[];
    keep: 'first' | 'last';
  }>({
    dedupeOn: [],
    keep: 'first',
  });
  const [columnMapping, setColumnMapping] = useState<Array<ColumnMapping>>(
    previewColumns
      .filter(col => col.key !== 'skyvue-row-preview')
      .map(col => ({
        importKey: col.key,
        mapTo: boardData.columns.find(col_ => col_.value === col.key)?._id,
      })),
  );

  return (
    <div className="flex flex-col space-y-8 mt-8">
      {view === 'preview' ? (
        <>
          <div>
            <Label>View of current first and last rows</Label>
            <div style={{ maxWidth: 'calc(100% - 1rem)' }} className="overflow-auto">
              <Table
                pagination={{ hideOnSinglePage: true }}
                columns={previewColumns}
                dataSource={uploadPreview.records}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 my-2">
            <Label className="flex items-center" unBold>
              <Switch
                checked={shouldDedupe}
                onChange={() => {
                  if (shouldDedupe) {
                    setDedupeSettings({
                      dedupeOn: [],
                      keep: 'first',
                    });
                  }
                  setShouldDedupe(!shouldDedupe);
                }}
              />
              <span className="ml-4">Filter duplicate records</span>
            </Label>
          </div>
          {shouldDedupe && (
            <DedupeController
              previewColumns={previewColumns}
              uploadPreview={uploadPreview}
              dedupeSettings={dedupeSettings}
              setDedupeSettings={setDedupeSettings}
            />
          )}
        </>
      ) : (
        <ImportColumnMapping
          columnMapping={columnMapping}
          setColumnMapping={setColumnMapping}
          previewColumns={previewColumns.filter(
            col => col.key !== 'skyvue-row-preview',
          )}
        />
      )}
      {uploadPreview.records && uploadPreview.records.length > 0 && (
        <div className="flex items-center justify-center">
          {view === 'mapping' && (
            <ButtonTertiary onClick={() => setView('preview')}>
              Go back
            </ButtonTertiary>
          )}
          <ButtonTertiary onClick={() => setUploadPreview(undefined)}>
            Cancel
          </ButtonTertiary>
          <ButtonPrimary
            onClick={() => {
              if (view === 'preview') {
                setView('mapping');
                return;
              }

              setLoading(true);
              socket?.emit('importLastAppended', {
                columnMapping,
                dedupeSettings,
              });
              setUploadPreview(undefined);
            }}
            disabled={uploadPreview.records.length === 0}
          >
            Continue
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
};

export default CurrentImport;
