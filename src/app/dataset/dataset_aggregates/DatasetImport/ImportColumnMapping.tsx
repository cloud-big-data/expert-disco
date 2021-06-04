import React, { FC } from 'react';

import { Label } from 'components/ui/Typography';
import useDatasetContext from 'hooks/useDatasetContext';
import Select from 'components/ui/Select';
import { ColumnMapping } from 'app/dataset/types';
import { PreviewColumn } from './DatasetImport';

const ImportColumnMapping: FC<{
  previewColumns: PreviewColumn[];
  columnMapping: ColumnMapping[];
  setColumnMapping: (mapping: ColumnMapping[]) => void;
}> = ({ previewColumns, columnMapping, setColumnMapping }) => {
  const { boardData } = useDatasetContext()!;

  console.log(columnMapping);

  return (
    <div>
      <Label>Tell us where to add your new data</Label>
      <div className="mt-4 grid grid-cols-3 gap-y-2  ">
        <Label>Imported column</Label>
        <div />
        <Label>Should map to</Label>
        {previewColumns.map(col => (
          <React.Fragment key={col.key}>
            <div className="col-span-1">{col.title}</div>
            <i className="fal fa-long-arrow-right col-span-1" />
            <div className="col-span-1">
              <Select
                options={boardData.columns.map(col => ({
                  name: col.value ?? col._id,
                  value: col._id,
                }))}
                value={
                  columnMapping.find(mapping => mapping.importKey === col.key)?.mapTo
                }
                onChange={e => {
                  setColumnMapping(
                    columnMapping.map(mapping =>
                      col.key === mapping.importKey
                        ? {
                            ...mapping,
                            mapTo: e,
                          }
                        : mapping,
                    ),
                  );
                }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ImportColumnMapping;
