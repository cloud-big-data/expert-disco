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
}) => {
  const existingUpdate = (cell: any) =>
    cellUpdates.find(update => update.cellId === cell._id);

  return iterable.map((cell: any) =>
    existingUpdate(cell)
      ? {
          ...cell,
          value: existingUpdate(cell)!.updatedValue,
        }
      : cell,
  );
};

export default returnUpdatedCells;
