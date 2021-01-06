import moment from 'moment';
import { DataTypes, Formats, FormatSettings } from '../types';

const formatValue = ({
  desiredFormat,
  dataType,
  value,
  formatSettings,
}: {
  desiredFormat?: Formats;
  dataType?: DataTypes;
  value?: string;
  formatSettings?: FormatSettings;
}) => {
  if (!value) return;
  if (dataType === 'date') {
    const date = moment(value);
    if (desiredFormat === 'iso string') {
      return date.toISOString();
    }

    return date.format(desiredFormat);
  }

  if (dataType === 'number') {
    const parsed = parseFloat(value);

    if (desiredFormat === 'currency') {
      const asCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: formatSettings?.currencyCode ?? 'USD',
      }).format(parsed);

      return (formatSettings?.decimalPoints ?? 2) < 1
        ? asCurrency.replace(/\D00$/, '')
        : asCurrency;
    }

    if (desiredFormat === 'percent') {
      return `${(parsed * 100).toFixed(formatSettings?.decimalPoints ?? 2)}%`;
    }

    return formatSettings?.commas ?? true
      ? parsed.toLocaleString('en-US', {
          minimumFractionDigits: formatSettings?.decimalPoints ?? 2,
          maximumFractionDigits: formatSettings?.decimalPoints ?? 2,
        })
      : parsed.toFixed(formatSettings?.decimalPoints ?? 2);
  }

  return value;
};

export default formatValue;
