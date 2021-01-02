import * as R from 'ramda';
import { DataTypes } from '../types';

const typesAreCompatible = R.curry(
  (currentType: DataTypes, desiredType: DataTypes): boolean => {
    if (currentType === 'string' && desiredType === 'number') return false;
    // if (currentType === 'date' && desiredType === 'number') return false;
    return true;
  },
);

export default typesAreCompatible;
