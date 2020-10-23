/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// type IterableType<T extends { _id: string; value: string | number | null }>
/**
 * returns array of rows with an updated value
 */
const returnUpdatedCells = <
  IterableType extends { _id: string; value: string | number | null }
>({
  iterable,
  cellUpdates,
}: {
  // todo fix iterable type
  iterable: IterableType[];
  cellUpdates: Array<{
    cellId: string;
    updatedValue: string;
  }>;
}): IterableType[] => {
  const existingUpdate = (cell: IterableType) =>
    cellUpdates.find(update => update.cellId === cell._id);

  return iterable.map((cell: IterableType) =>
    existingUpdate(cell)
      ? {
          ...cell,
          value: existingUpdate(cell)!.updatedValue,
        }
      : cell,
  );
};

export default returnUpdatedCells;
