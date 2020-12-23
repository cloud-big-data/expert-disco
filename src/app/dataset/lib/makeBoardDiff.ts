import * as R from 'ramda';
import { IBoardData, IColumn, IRow } from '../types';

type DiffTypes = 'addition' | 'modification' | 'removal';

const determineDiffType = (prev: any[], current: any[]): DiffTypes => {
  if (prev.length > current.length) {
    return 'removal';
  }
  if (prev.length < current.length) {
    return 'addition';
  }
  if (prev.length === current.length) {
    return 'modification';
  }

  return 'modification';
};

const makeBoardDiff = (
  prevBoardData: IBoardData,
  newBoardData: IBoardData,
): {
  colDiff?: {
    diff: IColumn[];
    type: DiffTypes;
  };
  rowDiff?: {
    diff: IRow[];
    type: DiffTypes;
  };
} => {
  const sections = ['rows', 'columns'];
  const diffTypes = sections.map(section =>
    determineDiffType(prevBoardData[section], newBoardData[section]),
  );

  const [rowArgs, colArgs] = diffTypes.map((diffType, index) =>
    diffType === 'modification'
      ? [newBoardData[sections[index]], prevBoardData[sections[index]]]
      : diffType === 'addition'
      ? [newBoardData[sections[index]], prevBoardData[sections[index]]]
      : [prevBoardData[sections[index]], newBoardData[sections[index]]],
  );

  const colDiff = R.difference(colArgs[0])(colArgs[1]) as IColumn[];
  const rowDiff = R.difference(rowArgs[0])(rowArgs[1]) as IRow[];

  return {
    colDiff:
      colDiff.length > 0
        ? {
            diff: colDiff,
            type: diffTypes[1],
          }
        : undefined,
    rowDiff:
      rowDiff.length > 0
        ? {
            diff: rowDiff,
            type: diffTypes[0],
          }
        : undefined,
  };
};

export default makeBoardDiff;
