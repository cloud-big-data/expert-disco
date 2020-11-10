export interface ValueSet {
  label: string;
  value: string;
}

export enum DataTypes {
  number,
  string,
  date,
}

export interface ICell {
  _id: string;
  value: string | number | null;
}

export interface IColumn extends ICell {
  dataType: DataTypes;
  /**
   * colWidth: The width of the column, in px.
   */
  colWidth?: number;
}

export interface IRow {
  _id: string;
  cells: ICell[];
  index: number;
  /**
   * rowHeight: The height of the row, in px.
   */
  rowHeight?: number;
  dragging?: boolean;
}

type UserId = string;

/**
 * The data stored in the grid itself. This information should persist from session to session.
 * For the viewable, non-persistent state of the board, use IBoardState
 */
export interface IBoardData {
  visibilitySettings: {
    owner: UserId;
    editors: UserId[];
    viewers: UserId[];
  };
  columns: IColumn[];
  rows: IRow[];
}

export interface IBoardMeta {
  title: string;
  updatedAt: string;
  createdAt: string;
}

/**
 * The non-persistent state of the grid.
 * This interfaces with viewable properties of the grid that should not persist from session to session, and
 * should not be stored in the database.
 *
 * Board data (cells and columns is stored in IGridData)
 */
export interface IBoardState {
  cellsState: {
    activeCell: string;
    selectedCell: string;
    highlightedCells: string[];
    copyingCell: string;
  };
  rowsState: {
    selectedRow: string;
    draggedRows: string[];
  };
  columnsState: {
    selectedColumn: number;
    activeColumn: number;
    draggedColumns: number[];
  };
  formulaBar: {
    active: boolean;
  };
}
