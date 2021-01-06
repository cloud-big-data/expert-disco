import moment from 'moment';
import { DataTypes } from '../types';

const parseDataType = (value: string): DataTypes => {
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
    return 'number';
  }
  if (moment(value, moment.ISO_8601, true).isValid()) {
    return 'date';
  }
  return 'string';
};

export default parseDataType;
