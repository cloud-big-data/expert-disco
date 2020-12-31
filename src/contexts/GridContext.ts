import { ChangeHistoryItem } from 'app/dataset/types';
import { createContext } from 'react';

interface IGridContext {
  gridRef: React.RefObject<HTMLDivElement>;
  visibleRows?: [number, number];
  handleChange: (changeHistoryItem: ChangeHistoryItem) => void;
}

const GridContext = createContext<null | IGridContext>(null);

export default GridContext;
