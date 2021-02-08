export interface IReducerAction<PayloadSchema> {
  type: string;
  payload: PayloadSchema;
}

export interface FixedLengthArray<T extends any, L extends number> extends Array<T> {
  0: T;
  length: L;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
