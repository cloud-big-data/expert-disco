import { ICell } from "../types";
import * as R from "ramda";

/**
 * returns array of rows with an updated value
 */
const returnUpdatedCells = ({
  iterable,
  cellId,
  updatedValue
}: {
  iterable: ICell[];
  cellId: string;
  updatedValue: string;
}) =>
    R.map(
      R.ifElse(
        R.propEq("_id", cellId),
        R.assoc("value", updatedValue),
        (item) => item
      )
    )(iterable)

export default returnUpdatedCells;