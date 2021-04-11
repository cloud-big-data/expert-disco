import React, { FC, useContext } from 'react';
import { useQuery } from 'react-query';
import * as R from 'ramda';

import InlineLoading from 'components/ui/InlineLoading';
import UserContext from 'contexts/userContext';

import useDatasetContext from 'hooks/useDatasetContext';
import skyvueFetch from 'services/skyvueFetch';
import { Empty } from 'antd';
import { Helper, Label } from 'components/ui/Typography';
import addCommas from 'utils/addCommas';
import Line from 'components/ui/Line';

const ImportHistory: FC = () => {
  const { datasetHead } = useDatasetContext()!;
  const { accessToken } = useContext(UserContext);
  const { data: imports, isLoading } = useQuery<
    {
      _id: string;
      userId: string;
      datasetId: string;
      beginningRowCount: number;
      endingRowCount: number;
      updatedAt: string;
      createdAt: string;
    }[]
  >(undefined, () =>
    skyvueFetch(accessToken).get(`/datasets/append/${datasetHead._id}`),
  );

  if (isLoading) {
    return (
      <div className="absolute__center">
        <InlineLoading />
      </div>
    );
  }

  if (!imports || imports.length === 0) {
    return (
      <div className="mt-12">
        <Empty />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const sortedImports = R.sortBy(R.prop('createdAt'), imports) as typeof imports;
  const firstImport = sortedImports[0];

  return (
    <div className="flex flex-col mt-8 space-y-4">
      <h6>History of imports</h6>
      <div className="w-full my-8 mx-auto grid grid-cols-12 gap-x-4 items-center">
        <div className="col-span-6 text-left">
          <Label>Original dataset</Label>
        </div>
        <div className="col-span-6 text-right">
          {addCommas(firstImport.beginningRowCount)}&nbsp; records
        </div>
        {sortedImports.map(item => (
          <React.Fragment key={item._id}>
            <div className="col-span-6 text-left">
              <Label unBold>{new Date(item.createdAt).toLocaleDateString()}</Label>
            </div>
            <div className="col-span-6 text-right">
              + {addCommas(item.endingRowCount - item.beginningRowCount)}&nbsp;
              records
            </div>
          </React.Fragment>
        ))}
        <Line className="col-span-12" />
        <div className="col-span-6 text-left">
          <Label>Current dataset size*</Label>
        </div>
        <div className="col-span-6 text-right">
          {addCommas(datasetHead.rowCount ?? 0)}&nbsp; records
        </div>
      </div>
      <Helper>
        * Includes deleted rows, which may cause this number to not be the total sum
        of all imports.
      </Helper>
    </div>
  );
};

export default ImportHistory;
