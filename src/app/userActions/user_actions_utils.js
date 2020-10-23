import * as r from 'ramda';

export const formErrors = formState => r.pluck('error')(formState);
