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
  if (value === undefined || value === null) return;
  const parsed =
    desiredFormat === 'percent' ? parseFloat(value) * 100 : parseFloat(value);
  const suffix = desiredFormat === 'percent' ? '%' : '';

  if (desiredFormat === 'currency') {
    const asCurrency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formatSettings?.currencyCode ?? 'USD',
    }).format(parsed);

    return (formatSettings?.decimalPoints ?? 2) < 1
      ? asCurrency.replace(/\D00$/, '')
      : asCurrency;
  }

  return formatSettings?.commas ?? true
    ? parsed.toLocaleString('en-US', {
        minimumFractionDigits: formatSettings?.decimalPoints ?? 2,
        maximumFractionDigits: formatSettings?.decimalPoints ?? 2,
      }) + suffix
    : parsed.toFixed(formatSettings?.decimalPoints ?? 2) + suffix;
};

const formatDate = ({ desiredFormat, value }: FormattingParams) => {
  if (value === undefined || value === null) return;
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
  if (value === undefined || value === null) return;
  try {
    switch (dataType) {
      case 'date':
        return formatDate(params);
      case 'number':
        return formatNumber(params);
      default:
        return value;
    }
  } catch (e) {
    return value.toString();
  }
};

export default formatValue;
