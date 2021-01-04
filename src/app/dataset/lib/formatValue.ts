import moment from 'moment';
import { DataTypes, Formats } from '../types';

const formatValue = ({
  desiredFormat,
  dataType,
  value,
  additionalFormatKey,
}: {
  desiredFormat?: Formats;
  dataType?: DataTypes;
  value?: string;
  additionalFormatKey?: string;
}) => {
  if (!value) return;
  if (dataType === 'date') {
    const date = moment(value);
    return date.format(desiredFormat);
  }

  if (dataType === 'number') {
    const parsed = parseFloat(value);

    if (desiredFormat === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: additionalFormatKey ?? 'USD',
      }).format(parsed);
    }

    if (desiredFormat === 'decimal') {
      return parsed.toFixed(2);
    }

    if (desiredFormat === 'percent') {
      return `${parsed * 100}%`;
    }
    // 'number', 'decimal', 'percent', 'currency'

    return value;
  }

  return value;
};

export default formatValue;
