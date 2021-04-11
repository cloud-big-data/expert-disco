import React, { FC } from 'react';

import { UploadPreview, DedupeSettings } from 'app/dataset/types';
import Checkbox from 'components/ui/Checkbox';
import { Helper, Label } from 'components/ui/Typography';
import enumerateText from 'utils/enumerateText';
import Select from 'components/ui/Select';
import { PreviewColumn } from './DatasetImport';

const DedupeController: FC<{
  previewColumns: PreviewColumn[];
  uploadPreview: UploadPreview;
  dedupeSettings: DedupeSettings;
  setDedupeSettings: (settings: DedupeSettings) => void;
}> = ({ previewColumns, dedupeSettings, setDedupeSettings }) => {
  const { dedupeOn } = dedupeSettings;

  return (
    <div>
      <Label unBold>
        Select the fields relevant for determining a duplicate record.
      </Label>
      <Helper>
        Your dataset will keep 1 instance of rows where all of these columns are of
        the same value.
      </Helper>
      <div className="flex flex-col ml-2">
        {previewColumns
          .filter(col => col.key !== 'skyvue-row-preview')
          .map(col => (
            <div key={col.key} className="flex">
              <Label unBold>
                <Checkbox
                  onChange={e =>
                    setDedupeSettings({
                      ...dedupeSettings,
                      dedupeOn: e.target.checked
                        ? [...dedupeOn, col.key]
                        : dedupeOn.filter(key => key !== col.key),
                    })
                  }
                  checked={dedupeOn.includes(col.key)}
                />
                <span className="ml-4">{col.title}</span>
              </Label>
            </div>
          ))}
        {dedupeOn.length > 0 && (
          <div className="flex flex-col space-y-2">
            <Label unBold>
              Rows where {dedupeOn.length === 1 && `${dedupeOn[0]} is equal `}
              {dedupeOn.length === 2 &&
                `${dedupeOn[0]} and ${dedupeOn[1]} are equal `}
              {dedupeOn.length >= 3 && `${enumerateText(dedupeOn)} are all equal `}
              will be filtered from this dataset.
            </Label>
            <div>
              <Label>Keep</Label>
              <Select
                onChange={e =>
                  setDedupeSettings({
                    ...dedupeSettings,
                    keep: e as 'first' | 'last',
                  })
                }
                value={dedupeSettings.keep}
                options={[
                  { name: 'the first occurence', value: 'first' },
                  { name: 'the last occurence', value: 'last' },
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DedupeController;
