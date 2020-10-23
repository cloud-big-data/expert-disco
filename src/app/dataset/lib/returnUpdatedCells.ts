/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * returns array of rows with an updated value
 */
const returnUpdatedCells = ({
  iterable,
  cellUpdates,
}: {
  // todo fix iterable type
  iterable: any[];
  cellUpdates: Array<{
    cellId: string;
    updatedValue: string;
  }>;
}) =>
  iterable.map((cell: any) =>
    cellUpdates.some(update => update.cellId === cell._id)
      ? {
          ...cell,
          value: cellUpdates.find(update => update.cellId === cell._id)!
            .updatedValue,
        }
      : cell,
  );

export default returnUpdatedCells;
