// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as R from 'ramda';

const mapIndexed = R.addIndex(R.map);
const enumerateText = (array: Array<string | undefined>): string =>
  R.pipe(
    R.filter(Boolean),
    mapIndexed((val, index) => (index === array.length - 1 ? `and ${val}` : val)),
    R.join(', '),
  )(array);

export default enumerateText;
