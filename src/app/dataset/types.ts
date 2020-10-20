interface ValueSet {
  label: string;
  value: string;
}

export enum DataTypes {
  number,
  string,
  date
}

export interface IBoardState {
  cellsState: {
    activeCell: string;
    selectedCell: string;
    highlightedCells: string[];
  }
  rowsState: {
    selectedRow: string;
  }
  columnsState: {
    selectedColumn: number;
    activeColumn: number;
  }
}

export interface IColumn {
  _id: string;
  title: ValueSet;
  dataType: DataTypes;
  /**
   * colWidth: The width of the column, in px.
   */
  colWidth?: number;
  highlighted?: boolean;
  dragging?: boolean;
  // sort direction?
};

export interface ICell {
  _id: string;
  value: string | number | null;
}

export interface IRow {
  _id: string;
  cells: ICell[];
  /**
   * rowHeight: The height of the row, in px.
   */
  rowHeight?: number;
  dragging?: boolean;
};

type UserId = string;

export interface IDataset {
  updatedAt: string;
  createdAt: string;
  title: string;
  visibilitySettings: {
    owner: UserId;
    editors: UserId[];
    viewers: UserId[];
  };
  columns: IColumn[];
  rows: IRow[];
}