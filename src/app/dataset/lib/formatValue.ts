import { format } from 'date-fns';
import { DataTypes, Formats, FormatSettings } from '../types';

interface FormattingParams {
  desiredFormat?: Formats;
  dataType?: DataTypes;
  value?: string;
  formatSettings?: FormatSettings;
}

const formatNumber = ({
  desiredFormat,
  dataType,
  value,
  formatSettings,
}: FormattingParams) => {
  if (!value) return;
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
};

const formatDate = ({ desiredFormat, value }: FormattingParams) => {
  if (!value) return;
  const date = new Date(value);
  switch (desiredFormat) {
    case 'iso string':
      return date.toISOString();
    case 'datetime':
      return date.toLocaleString();
    case 'locale date':
      return date.toLocaleDateString();
    case 'locale time':
      return date.toLocaleTimeString();
    default:
      return format(date, desiredFormat ?? 'MM-dd-yyyy');
  }
};

const formatValue = (params: FormattingParams) => {
  const { value, dataType } = params;
  if (!value) return;
  switch (dataType) {
    case 'date':
      return formatDate(params);
    case 'number':
      return formatNumber(params);
    default:
      return value;
  }
};

export default formatValue;
