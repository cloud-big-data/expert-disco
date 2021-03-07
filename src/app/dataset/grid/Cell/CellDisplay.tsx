import formatValue from 'app/dataset/lib/formatValue';
import { DataTypes, Formats, FormatSettings } from 'app/dataset/types';
import React, { FC } from 'react';

const CellDisplay: FC<{
  format?: Formats;
  formatSettings?: FormatSettings;
  colDataType?: DataTypes;
  value?: string;
}> = ({ colDataType, formatSettings, format, value }) => (
  <span className="cell__value">
    {formatValue({
      desiredFormat: format,
      dataType: colDataType,
      value,
      formatSettings,
    })}
  </span>
);

export default React.memo(CellDisplay);
