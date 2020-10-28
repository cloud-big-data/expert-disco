import { createContext } from 'react';

interface IGridContext {
  gridRef: React.RefObject<HTMLDivElement>;
  visibleRows?: [string, string];
}

const GridContext = createContext<null | IGridContext>(null);

export default GridContext;
