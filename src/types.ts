export interface IReducerAction<PayloadSchema> {
  type: string;
  payload: PayloadSchema;
}
