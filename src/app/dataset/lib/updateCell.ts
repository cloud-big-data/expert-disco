import { IBoardData, IRow } from "../types";
import * as R from "ramda";

const updateCell = ({
  iterable,
  cellId,
  updatedValue
}: {
  iterable: IBoardData['rows'];
  cellId: string;
  updatedValue: string;
}) =>
  R.map(
    (x: IRow) =>
      R.map(
        R.ifElse(
          R.propEq("_id", cellId),
          R.assoc("value", updatedValue),
          (item) => item
        )
      )(x.cells)
  )(iterable)

export default updateCell;