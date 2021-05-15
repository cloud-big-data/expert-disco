// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as R from 'ramda';

const sortKeysByColumnOrder = (columnIds: string[], selector = 'id') =>
  R.sortBy(R.pipe(R.prop(selector), R.indexOf(R.__, columnIds)));

export default sortKeysByColumnOrder;
