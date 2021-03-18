import React, { FC } from 'react';
import { Text } from 'components/ui/Typography';

import humanFileSize from 'utils/humanFileSize';
import { FILE_SIZE_CAP_IN_BYTES } from './DatasetUploader';

const UploadExceedsLimits: FC = () => (
  <div className="flex flex-col items-center justify-center w-4/5 h-full m-auto">
    <i style={{ fontSize: '7rem' }} className="fad fa-engine-warning text-red-400" />
    <h3>File too large</h3>
    <Text size="lg" len="short">
      While Skyvue is beta testing, we currently support file uploads of up to{' '}
      {humanFileSize(FILE_SIZE_CAP_IN_BYTES)}. However, we're always open to raising
      this limit! Shoot us an email at admin@skyvue.io to file a feature request.
    </Text>
  </div>
);

export default UploadExceedsLimits;
