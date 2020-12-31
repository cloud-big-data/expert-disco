export interface ICellUpdates<IterableType> {
  iterable: IterableType[];
  cellUpdates: Array<{
    cellId: string;
    updatedValue: string;
  }>;
}

// type IterableType<T extends { _id: string; value: string | number | null }>
/**
 * returns array of rows with an updated value
 */
const returnUpdatedCells = <IterableType extends { _id: string; value?: string }>({
  iterable,
  cellUpdates,
}: ICellUpdates<IterableType>): IterableType[] => {
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
