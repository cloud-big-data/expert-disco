export interface ValueSet {
  label: string;
  value: string;
}

export type DataTypes = 'number' | 'string' | 'date';

export type FilterTypes =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'lessThan'
  | 'lessThanEqualTo'
  | 'greaterThan'
  | 'greaterThanEqualTo'
  | 'dateBetween';

export interface IJoinLayer {
  joinType: 'full' | 'left' | 'right' | 'inner';
  condition: {
    datasetId: string;
    select: string[]; // columns from joined dataset to select
    on: Array<{
      mainColumnId: string;
      joinedColumnId: string;
    }>;
  };
}

export type LogicalOperators = 'AND' | 'OR';
export type FilterCondition = {
  filterId: string;
  key: string;
  value: string | string[] | number | number[];
  predicateType: FilterTypes;
};
export type IFilterLayer = Array<
  | LogicalOperators
  | FilterCondition
  | Array<
      LogicalOperators | FilterCondition | Array<LogicalOperators | FilterCondition>
    >
>;

export type AggregateFunctions =
  | 'sum'
  | 'mean'
  | 'median'
  | 'countDistinct'
  | 'count'
  | 'max'
  | 'min'
  | 'stdev';

export interface IGroupLayer {
  groupedBy: string[];
  columnAggregates: {
    [key: string]: AggregateFunctions;
  };
}

export type SortDirections = 'desc' | 'asc';
export type ISortingLayer = Array<{
  key: string;
  direction: SortDirections;
}>;

type DateFormats =
  | 'MM-dd-yyyy'
  | 'dd-MM-yyyy'
  | 'yyyy-MM-dd'
  | 'MM/dd/yyyy'
  | 'dd/MM/yyyy'
  | 'yyyy/MM/dd'
  | 'MM-yyyy'
  | 'MM/yyyy'
  | 'MM/yy'
  | 'MM-yy'
  | 'time'
  | 'datetime'
  | 'iso string'
  | 'locale date'
  | 'locale time';

export type Formats =
  | 'number'
  | 'percent'
  | 'currency'
  | 'time'
  | 'datetime'
  | DateFormats;

export type IColumnFormatting = Array<{
  colId: string;
  format: Formats;
  additional?: string;
}>;

/**
 * The data stored in the grid itself. This information should persist from session to session.
 * For the viewable, non-persistent state of the board, use IBoardState
 */

export interface ICell {
  _id: string;
  columnId?: string;
  value?: string;
}

export interface NumberFormatSettings {
  decimalPoints?: number;
  currencyCode?: string;
  commas?: boolean;
}

export type FormatSettings = NumberFormatSettings;

export interface IColumn extends ICell {
  dataType: DataTypes;
  /**
   * colWidth: The width of the column, in px.
   */
  colWidth?: number;
  format?: Formats;
  datetime?: boolean;
  formatSettings?: FormatSettings;
  isSmartColumn?: boolean;
  foreignKeyId?: string;
  isJoined?: boolean;
  isUnique?: boolean;
}

export interface ISmartColumn extends IColumn {
  expression: string;
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

export type LayersTypes =
  | 'joins'
  | 'filters'
  | 'groupings'
  | 'sortings'
  | 'smartColumns'
  | 'formatting';

type UserId = string;

export interface BoardError {
  message: any;
  type: string;
  target: string;
  section: LayersTypes;
}

export type Privileges = 'owner' | 'editor' | 'viewer';

export interface IColumnSummary {
  [key: string]: {
    columnId: string;
    uniqueValues: number;
    sum: number;
    mean: number;
    min: number;
    max: number;
  };
}

export interface IBoardData {
  [key: string]: any;
  _id: string;
  visibilitySettings: {
    owner: UserId;
    editors: UserId[];
    viewers: UserId[];
  };
  columns: IColumn[];
  rows: IRow[];
  layers: {
    joins: IJoinLayer;
    filters: IFilterLayer;
    groupings: IGroupLayer;
    sortings: ISortingLayer;
    smartColumns: ISmartColumn[];
    formatting: IColumnFormatting;
  };
  layerToggles: {
    filters: boolean;
    groupings: boolean;
    smartColumns: boolean;
    joins: boolean;
  };
  errors?: Array<BoardError>;
  columnSummary: IColumnSummary;
}

export interface IBoardHead {
  _id?: string;
  title?: string;
  updatedAt?: string;
  createdAt?: string;
  skyvueFileSize?: number;
  csvFileSize?: number;
  rowCount?: number;
}

export interface ChangeHistoryItem {
  changeTarget: 'row' | 'column' | 'cell';
  targetId: string;
  prevValue?: string | IColumn | IRow;
  newValue?: string | IColumn | IRow;
  secondaryValue?: {
    prevValue?: string | IColumn | IRow | ICell[];
    newValue?: string | IColumn | IRow | ICell[];
    changeTarget?: 'row' | 'column' | 'cell' | 'cells';
  };
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
  changeHistory: ChangeHistoryItem[];
}

export interface IServerDataset {
  _id: string;
  userId: string;
  title: string;
  visibilitySettings: {
    owner: string;
    editors: string[];
    viewers: string[];
  };
  updatedAt: string;
  createdAt: string;
}

export type Destinations = 'csv' | 'sheets' | 'skyvue';
