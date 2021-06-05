import React, { FC } from 'react';
import * as R from 'ramda';

import { UploadPreview, DedupeSettings } from 'app/dataset/types';
import Checkbox from 'components/ui/Checkbox';
import { Helper, Label } from 'components/ui/Typography';
import enumerateText from 'utils/enumerateText';
import Select from 'components/ui/Select';
import useDatasetContext from 'hooks/useDatasetContext';
import { PreviewColumn } from './DatasetImport';

const DedupeController: FC<{
  previewColumns: PreviewColumn[];
  uploadPreview: UploadPreview;
  dedupeSettings: DedupeSettings;
  setDedupeSettings: (settings: DedupeSettings) => void;
}> = ({ previewColumns, dedupeSettings, setDedupeSettings }) => {
  const {
    boardData: { baseColumns },
  } = useDatasetContext()!;
  const { dedupeOn } = dedupeSettings;
  const colLookup = R.indexBy(R.prop('_id'), baseColumns);
  const dedupeValues = dedupeOn.map(x => colLookup[x]?.value).filter(Boolean);

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
        {baseColumns.map(col => (
          <div key={col._id} className="flex">
            <Label unBold>
              <Checkbox
                onChange={e =>
                  setDedupeSettings({
                    ...dedupeSettings,
                    dedupeOn: e.target.checked
                      ? [...dedupeOn, col._id]
                      : dedupeOn.filter(key => key !== col._id),
                  })
                }
                checked={dedupeOn.includes(col._id)}
              />
              <span className="ml-4">{col.value}</span>
            </Label>
          </div>
        ))}
        {dedupeValues.length > 0 && (
          <div className="flex flex-col space-y-2">
            <Label unBold>
              Rows where{' '}
              {dedupeValues.length === 1 && `${dedupeValues[0]} is equal `}
              {dedupeValues.length === 2 &&
                `${dedupeValues[0]} and ${dedupeValues[1]} are equal `}
              {dedupeValues.length >= 3 &&
                `${enumerateText(dedupeValues)} are all equal `}
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
