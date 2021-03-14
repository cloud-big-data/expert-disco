import * as R from 'ramda';

const keyLength = R.pipe(R.keys, R.length);

export default keyLength;
