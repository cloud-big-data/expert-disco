import { isValid } from 'date-fns';
import { DataTypes } from '../types';

const parseDataType = (value: string): DataTypes => {
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
    return 'number';
  }
  if (isValid(new Date(value))) {
    return 'date';
  }
  return 'string';
};

export default parseDataType;
